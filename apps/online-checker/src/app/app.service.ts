import { BotDatabaseService } from '@baneverywhere/db';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';
import { BOT_HANDLER_CONNECTION } from '@baneverywhere/namespaces';
import { ClientProxy } from '@nestjs/microservices';
import { BotPatterns } from '@baneverywhere/bot-interfaces';
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService,
    private readonly dbService: BotDatabaseService,
    @Inject(BOT_HANDLER_CONNECTION) private botHandlerClient: ClientProxy
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkOnline() {
    this.checkIfUserIsOnline();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  synchronizeBotStatus() {
    this.botHandlerClient.emit<void, unknown>(
      BotPatterns.BOT_GET_STATUS,
      uuidv4()
    );
  }

  onModuleInit() {
    this.checkIfUserIsOnline();
  }

  async checkIfUserIsOnline(cursor?: string) {
    const users = await this.dbService.user.findMany({
      select: {
        id: true,
        login: true,
      },
      take: 20,
      skip: cursor ? 1 : 0,
      ...(cursor ? { cursor: { id: cursor } } : {}),
    });

    if(users.length === 0) return;
    const {
      data: { access_token },
    } = await lastValueFrom(
      this.http.post<{ access_token: string }>(
        `https://id.twitch.tv/oauth2/token?client_id=${this.configService.get(
          'TWITCH_CLIENT_ID'
        )}&client_secret=${this.configService.get(
          'TWITCH_CLIENT_SECRET'
        )}&grant_type=client_credentials`
      )
    );

    const url = `https://api.twitch.tv/helix/streams?user_login=${users
      .map((user) => user.login)
      .join('&user_login=')}`;

    const channels = await lastValueFrom(
      this.http.get<{ data: Array<{ user_login: string; type: string }> }>(
        url,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Client-Id': this.configService.get<string>('TWITCH_CLIENT_ID'),
          },
        }
      )
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
