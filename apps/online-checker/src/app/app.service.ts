import { BotDatabaseService } from '@baneverywhere/db';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BOT_CONNECTION } from '@baneverywhere/namespaces';
import { ClientProxy } from '@nestjs/microservices';
import { BotPatterns } from '@baneverywhere/bot-interfaces';
import { v4 as uuidv4 } from 'uuid';
import { logError } from '@baneverywhere/error-handler';
import { TwitchClientService } from '@baneverywhere/twitch-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService implements OnModuleInit {
  private MAX_USERS_PER_BOT: number;

  constructor(
    public readonly dbService: BotDatabaseService,
    @Inject(BOT_CONNECTION) public botClient: ClientProxy,
    public readonly twitchClientService: TwitchClientService,
    private readonly configService: ConfigService
  ) {
    this.MAX_USERS_PER_BOT =
      parseInt(this.configService.get<string>('MAX_USERS_PER_BOT', '1000'));
  }

  @Cron(CronExpression.EVERY_MINUTE)
  @logError()
  async checkOnline() {
    this.checkIfUserIsOnline();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  @logError()
  synchronizeBotStatus() {
    this.botClient.emit<void, unknown>(
      BotPatterns.BOT_GET_STATUS,
      uuidv4()
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  @logError()
  async removeMachinesInLimbo() {
    const machines = await this.dbService.machine.findMany({
      where: {
        lastSeen: {
          lt: new Date(Date.now() - 1000 * 120),
        },
      },
      select: {
        uuid: true,
      },
    });

    await this.dbService.user.updateMany({
      where: {
        machineUUID: {
          in: machines.map((m) => m.uuid),
        },
      },
      data: {
        machineUUID: null,
      },
    });

    await this.dbService.machine.deleteMany({
      where: {
        uuid: {
          in: machines.map((m) => m.uuid),
        },
      },
    });
  }

  @logError()
  onModuleInit() {
    this.checkIfUserIsOnline();
  }

  @logError()
  async preassignMachineToUser(username: string): Promise<string> {
    const machinesWithCount = await this.dbService.machine.findMany({
      select: {
        uuid: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        users: {
          _count: 'asc',
        },
      },
      take: 1,
    });

    const machine = machinesWithCount.find(
      (m) => m._count.users < this.MAX_USERS_PER_BOT
    );
    if (!machine) throw new Error('No machine available');

    await this.dbService.user.update({
      where: {
        login: username
      },
      data: {
        machineUUID: machine.uuid,
      },
    });

    return machine.uuid;
  }

  @logError()
  async checkIfUserIsOnline(cursor?: number) {
    const users = await this.dbService.user.findMany({
      select: {
        id: true,
        login: true,
        machineUUID: true,
      },
      take: 20,
      skip: cursor ? 1 : 0,
      ...(cursor ? { cursor: { id: cursor } } : {}),
    });

    if (users.length === 0) return;
    const {
      data: { data: channels },
    } = await this.twitchClientService.checkUsersStatus(
      users.map((u) => u.login)
    );

    const usernames = channels.map(channel => channel.user_login);

    const online = users.filter(user => usernames.includes(user.login));
    const offline = users.filter(user => !usernames.includes(user.login));

    await this.dbService.user.updateMany({
      where: {
        login: {
          in: offline.map((u) => u.login),
        },
      },
      data: {
        machineUUID: null,
      },
    });

    await Promise.all(offline.map(async (u) => {
      this.botClient.emit(BotPatterns.USER_OFFLINE, {
        channelName: u.login,
        botId: u.machineUUID,
      });
    }));

    await Promise.all(online.map(async (user) => {
      if(user.machineUUID) return;
      const machineID = await this.preassignMachineToUser(user.login);
      this.botClient.emit(BotPatterns.USER_ONLINE, {
        channelName: user.login,
        botId: machineID,
      });
    }));

    if (users.length === 20) {
      await this.checkIfUserIsOnline(users[19].id);
    }
  }
}
