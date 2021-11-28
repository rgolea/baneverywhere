import { BotDatabaseService } from '@baneverywhere/db';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BOT_HANDLER_CONNECTION } from '@baneverywhere/namespaces';
import { ClientProxy } from '@nestjs/microservices';
import { BotPatterns } from '@baneverywhere/bot-interfaces';
import { v4 as uuidv4 } from 'uuid';
import { logError } from '@baneverywhere/error-handler';
import { TwitchClientService } from '@baneverywhere/twitch-client';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    public readonly dbService: BotDatabaseService,
    @Inject(BOT_HANDLER_CONNECTION) public botHandlerClient: ClientProxy,
    public readonly twitchClientService: TwitchClientService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  @logError()
  async checkOnline() {
    this.checkIfUserIsOnline();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  @logError()
  synchronizeBotStatus() {
    this.botHandlerClient.emit<void, unknown>(
      BotPatterns.BOT_GET_STATUS,
      uuidv4()
    );
  }

  @logError()
  onModuleInit() {
    this.checkIfUserIsOnline();
  }

  @logError()
  async checkIfUserIsOnline(cursor?: number) {
    const users = await this.dbService.user.findMany({
      select: {
        id: true,
        login: true,
      },
      take: 20,
      skip: cursor ? 1 : 0,
      ...(cursor ? { cursor: { id: cursor } } : {}),
    });

    if (users.length === 0) return;
    const channels = await this.twitchClientService.checkUsersStatus(
      users.map((u) => u.login)
    );

    const onlineUsers = channels.data.data.map((channel) => channel.user_login);
    const offlineUsers = users.filter(
      (user) => !onlineUsers.includes(user.login)
    );

    onlineUsers.forEach((user) => {
      this.botHandlerClient.emit(BotPatterns.USER_ONLINE, user);
    });

    offlineUsers.forEach((user) => {
      this.botHandlerClient.emit(BotPatterns.USER_OFFLINE, user.login);
    });

    if (users.length === 20) {
      await this.checkIfUserIsOnline(users[19].id);
    }
  }
}
