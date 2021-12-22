import { BotDatabaseService } from '@baneverywhere/db';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Action, BanEverywhereSettings } from '@prisma/client';
import { Job, Queue } from 'bull';
import { Actions } from '@prisma/client';
import { BOT_CONNECTION } from '@baneverywhere/namespaces';
import { ClientProxy } from '@nestjs/microservices';
import { BotPatterns } from '@baneverywhere/bot-interfaces';
import { logError } from '@baneverywhere/error-handler';
import { TwitchClientService } from '@baneverywhere/twitch-client';

@Processor('queue')
export class QueueProcessor {
  constructor(
    private readonly dbService: BotDatabaseService,
    @InjectQueue('queue') private readonly queue: Queue,
    @Inject(BOT_CONNECTION) private readonly botHandlerClient: ClientProxy,
    private readonly twitchService: TwitchClientService
  ) {}

  @logError()
  public async handleBanUnban(
    action: Action,
    job: Job<Omit<Actions, 'queueFor'> & { cursor?: number }>
  ) {
    const pattern =
      action === Action.BAN
        ? BotPatterns.BOT_BAN_USER
        : BotPatterns.BOT_UNBAN_USER;

    const { cursor, ...data } = job.data;

    const settings = await this.dbService.settings.findMany({
      where: {
        fromUsername: data.streamer.substr(1),
      },
      take: 50,
      skip: cursor ? 1 : 0,
      ...(cursor ? { cursor: { id: cursor } } : null),
    });

    const users = await this.dbService.user.findMany({
      where: {
        login: {
          in: settings.map((setting) => setting.toUsername),
        },
      },
      select: {
        login: true,
        machineUUID: true,
      },
    });

    await Promise.all(
      settings.map(async (setting) => {
        const user = users.find((u) => u.login === setting.toUsername);
        const preapproved = Boolean(
          setting.settings === BanEverywhereSettings.AUTOMATIC &&
            user?.machineUUID
        );
        if (preapproved) {
          this.botHandlerClient.emit(pattern, {
            queueFor: setting.toUsername,
            ...data,
          });
        }

        await this.dbService.actions.create({
          data: {
            ...data,
            queueFor: setting.toUsername,
            inQueue: BanEverywhereSettings.AUTOMATIC === setting.settings,
            approved: BanEverywhereSettings.AUTOMATIC === setting.settings,
            processed: preapproved,
          },
        });
      })
    );

    if (settings.length === 50) {
      this.queue.add(action, {
        ...job.data,
        cursor: settings[49].id,
      });
    }

    return;
  }

  @Process(Action.BAN)
  @logError()
  async handleBan(job: Job<Omit<Actions, 'queueFor'> & { cursor?: number }>) {
    return await this.handleBanUnban(Action.BAN, job);
  }

  @Process(Action.UNBAN)
  @logError()
  async handleUnban(job: Job<Omit<Actions, 'queueFor'> & { cursor?: number }>) {
    return await this.handleBanUnban(Action.UNBAN, job);
  }

  @Process('queue')
  @logError()
  async handleQueue(job: Job<{ username: string; cursor?: number }>) {
    const { username, cursor } = job.data;
    const user = await this.dbService.user.findUnique({
      where: {
        login: username,
      },
    });

    const actions = await this.dbService.actions.findMany({
      where: {
        queueFor: username,
        inQueue: true,
        processed: false,
      },
      take: 50,
      skip: cursor ? 1 : 0,
      ...(cursor ? { cursor: { id: cursor } } : null),
    });

    if (actions.length === 50) {
      this.queue.add('queue', {
        ...job.data,
        cursor: actions[49].id,
      });
    }

    const approved = actions.filter(action => action.approved);

    approved.forEach((action) => {
      const pattern =
        action.action === Action.BAN
          ? BotPatterns.BOT_BAN_USER
          : BotPatterns.BOT_UNBAN_USER;
      this.botHandlerClient.emit(pattern, action);
    });

    if (user.machineUUID) {
      return await this.dbService.actions
        .updateMany({
          where: {
            id: {
              in: actions.map((action) => action.id),
            },
          },
          data: {
            processed: true,
          },
        })
        .catch((err) => console.log(err));
    } else {
      return;
    }
  }

  @Process('settings')
  @logError()
  async handleSettings(
    job: Job<{
      channelName: string;
      settings: BanEverywhereSettings;
      username: string;
    }>
  ) {
    const { channelName, settings, username } = job.data;
    const users = await this.twitchService.findUsernamesByLogin([
      channelName,
      username,
    ]);
    const user = users.find((u) => u.login === username);
    const channel = users.find((u) => u.login === channelName);
    if (!user || !channel) return;
    await this.dbService.settings.upsert({
      where: {
        fromId_toId: {
          fromId: user.id,
          toId: channel.id,
        },
      },
      create: {
        fromId: user.id,
        toId: channel.id,
        toUsername: channel.login,
        fromUsername: user.login,
        settings,
      },
      update: {
        settings,
      },
    });
  }
}
