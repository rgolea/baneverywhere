import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
} from '@nestjs/microservices';
import { BotClientService } from './bot-client/bot-client.service';
import { BOT_IDENTIFIER } from './bot.identifier';
import {
  BotConnectChannelParams,
  BotConnectChannelResponse,
  BotDisconnectChannelParams,
  BotGetStatusResponse,
  Never,
  respondLater,
  BotPatterns,
} from '@baneverywhere/bot-interfaces';
import { Actions } from '@prisma/client';
import { BotDatabaseService } from '@baneverywhere/db';
import { logError } from '@baneverywhere/error-handler';

@Controller('app')
export class AppController implements OnModuleInit {
  constructor(
    @Inject(BOT_IDENTIFIER) private readonly botIdentifier: string,
    private readonly botClientService: BotClientService,
    private readonly dbService: BotDatabaseService
  ) {

  }

  onModuleInit() {
    console.log('get status', this.botClientService.getStatus());
  }

  @EventPattern(BotPatterns.BOT_GET_STATUS)
  @logError()
  async getStatus() {
    await this.dbService.machine.update({
      where: {
        uuid: this.botIdentifier,
      },
      data: {
        lastSeen: new Date()
      }
    });
  }

  @MessagePattern(BotPatterns.USER_ONLINE)
  @logError()
  connectToChannel({
    channelName,
    botId,
  }: BotConnectChannelParams): Promise<BotConnectChannelResponse> | Never {
    const status = this.botClientService.getStatus();
    if (
      botId === this.botIdentifier &&
      !status.users.includes(`#${channelName}`)
    ) {
      return this.botClientService.joinChannel(channelName).then((status) => ({
        status,
      }));
    } else {
      return respondLater();
    }
  }

  @MessagePattern(BotPatterns.USER_OFFLINE)
  @logError()
  disconnectFromChannel({
    channelName,
  }: BotDisconnectChannelParams): BotGetStatusResponse | Never {
    const status = this.botClientService.getStatus();
    if (status.users.includes(`#${channelName}`)) {
      this.botClientService.leaveChannel(channelName);
      return {
        status: this.botClientService.getStatus(),
        identifier: this.botIdentifier,
      };
    } else {
      return respondLater();
    }
  }

  @EventPattern(BotPatterns.BOT_BAN_USER)
  @logError()
  banUser(action: Actions) {
    const status = this.botClientService.getStatus();
    const channel = `#${action.queueFor}`;
    if (status.users.find((user) => channel === user)) {
      return this.botClientService.banUser(action.queueFor, action);
    } else {
      return respondLater();
    }
  }

  @EventPattern(BotPatterns.BOT_UNBAN_USER)
  @logError()
  unbanUser(action: Actions) {
    const status = this.botClientService.getStatus();
    const channel = `#${action.queueFor}`;
    if (status.users.find((user) => channel === user)) {
      return this.botClientService.unbanUser(action.queueFor, action);
    } else {
      return respondLater();
    }
  }
}
