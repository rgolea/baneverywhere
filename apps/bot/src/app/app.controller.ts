import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { BotClientService } from './bot-client/bot-client.service';
import { BOT_IDENTIFIER } from './bot.identifier';
import { BOT_HANDLER_CONNECTION } from '@baneverywhere/namespaces';
import { interval, skip, take } from 'rxjs';

@Controller('app')
export class AppController {
  constructor(
    @Inject(BOT_IDENTIFIER) private readonly botIdentifier: string,
    private readonly botClientService: BotClientService,
    @Inject(BOT_HANDLER_CONNECTION)
    private readonly botHandlerConnection: ClientProxy
  ) {}

  @MessagePattern('bot:get:status')
  getStatus({ id }: { id: string }) {
    this.botHandlerConnection.emit('bot:status', {
      id,
      identifier: this.botIdentifier,
      count: this.botClientService.getStatus(),
    });
  }

  @MessagePattern('bot:connect:channel')
  async connectToChannel({
    channelName,
    botId,
  }: {
    channelName: string;
    botId: string;
  }) {
    if (botId === this.botIdentifier) {
      this.botClientService.joinChannel(channelName);
      return {
        count: this.botClientService.getStatus(),
      };
    } else {
      return interval(10000).pipe(skip(1), take(1));
    }
  }

  @MessagePattern('bot:disconnect:channel')
  disconnectFromChannel({ channelName }: { channelName: string }) {
    this.botClientService.leaveChannel(channelName);
    return {
      count: this.botClientService.getStatus(),
      identifier: this.botIdentifier
    }
  }
}
