import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
} from '@nestjs/microservices';
import { BotClientService } from './bot-client/bot-client.service';
import { BOT_IDENTIFIER } from './bot.identifier';
import { BOT_HANDLER_CONNECTION } from '@baneverywhere/namespaces';
import {
  BotConnectChannelParams,
  BotConnectChannelResponse,
  BotDisconnectChannelParams,
  BotGetStatusResponse,
  Never,
  respondLater,
  BotPatterns,
} from '@baneverywhere/bot-interfaces';

@Controller('app')
export class AppController {
  constructor(
    @Inject(BOT_IDENTIFIER) private readonly botIdentifier: string,
    private readonly botClientService: BotClientService,
    @Inject(BOT_HANDLER_CONNECTION)
    private readonly botHandlerConnection: ClientProxy
  ) {}

  @EventPattern(BotPatterns.BOT_GET_STATUS)
  getStatus() {
    this.botHandlerConnection.emit<void, BotGetStatusResponse>(
      BotPatterns.BOT_STATUS_RESPONSE,
      {
        identifier: this.botIdentifier,
        status: this.botClientService.getStatus(),
      }
    );
  }

  @MessagePattern(BotPatterns.BOT_CONNECT_CHANNEL)
  connectToChannel({
    channelName,
    botId,
  }: BotConnectChannelParams): Promise<BotConnectChannelResponse> | Never {
    if (botId === this.botIdentifier) {
      return this.botClientService.joinChannel(channelName).then((status) => ({
        status,
      }));
    } else {
      return respondLater();
    }
  }

  @MessagePattern('bot:disconnect:channel')
  disconnectFromChannel({
    channelName,
  }: BotDisconnectChannelParams): BotGetStatusResponse {
    this.botClientService.leaveChannel(channelName);
    return {
      status: this.botClientService.getStatus(),
      identifier: this.botIdentifier,
    };
  }
}