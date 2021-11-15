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
import { Actions } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(BOT_CONNECTION) private readonly botHandlerClient: ClientProxy,
    @InjectQueue('queue') private readonly queue: Queue
  ) {}

  @MessagePattern('bot.identifier.created')
  async botIdentifierCreated(id: string) {
    await this.appService.setOrUpdateMachineStatus(id, {
      count: 0,
      users: [],
    });
  }

  @MessagePattern('bot.identifier.destroyed')
  async botIdentifierDestroyed(id: string) {
    await this.appService.removeMachineStatus(id);
  }

  @MessagePattern(BotPatterns.BOT_STATUS_RESPONSE)
  async botStatus({ identifier, status }: BotGetStatusResponse) {
    await this.appService.setOrUpdateMachineStatus(identifier, status);
  }

  @EventPattern(BotPatterns.USER_ONLINE)
  async userOnline(channelName: string) {
    console.log('user online', channelName);
    const botId =
      await this.appService.preassignMachineToUser(channelName);
    if (!botId) return 'NOT_JOINED';
    const { status } = await lastValueFrom(
      this.botHandlerClient.send<BotConnectChannelResponse>(
        BotPatterns.BOT_CONNECT_CHANNEL,
        { channelName, botId }
      )
    );
    await this.appService.setOrUpdateMachineStatus(botId, status);
    await this.queue.add('queue', { username: channelName });
    return 'OK';
  }

  @MessagePattern(BotPatterns.USER_OFFLINE)
  async userOffline(channelName: string) {
    const { identifier, count } = await lastValueFrom(
      this.botHandlerClient.send('bot:disconnect:channel', { channelName })
    );
    await this.appService.setOrUpdateMachineStatus(identifier, count);
    return 'OK';
  }
}
