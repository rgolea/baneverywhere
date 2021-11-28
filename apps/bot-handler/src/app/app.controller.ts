import { BOT_CONNECTION } from '@baneverywhere/namespaces';
import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
} from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AppService } from './app.service';
import {
  BotConnectChannelResponse,
  BotGetStatusResponse,
  BotPatterns,
} from '@baneverywhere/bot-interfaces';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { logError } from '@baneverywhere/error-handler';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(BOT_CONNECTION) private readonly botHandlerClient: ClientProxy,
    @InjectQueue('queue') private readonly queue: Queue
  ) {}

  // @MessagePattern(BotPatterns.BOT_STATUS_RESPONSE)
  // @logError()
  // async botStatus({ identifier, status }: BotGetStatusResponse) {
  //   await this.appService.setOrUpdateMachineStatus(identifier, status);
  // }

  @EventPattern(BotPatterns.USER_ONLINE)
  @logError()
  async userOnline(channelName: string) {

    const botId =
      await this.appService.preassignMachineToUser(channelName);
    if (!botId) return 'NOT_JOINED';
    await lastValueFrom(
      this.botHandlerClient.send<BotConnectChannelResponse>(
        BotPatterns.BOT_CONNECT_CHANNEL,
        { channelName, botId }
      )
    );

    await this.queue.add('queue', { username: channelName });
    return 'OK';
  }

  // @MessagePattern(BotPatterns.USER_OFFLINE)
  // @logError()
  // async userOffline(channelName: string) {
  //   const { identifier, count } = await lastValueFrom(
  //     this.botHandlerClient.send(BotPatterns.BOT_DISCONNECT_CHANNEL, { channelName })
  //   );
  //   await this.appService.setOrUpdateMachineStatus(identifier, count);
  //   return 'OK';
  // }
}
