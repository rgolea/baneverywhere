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

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(BOT_CONNECTION) private readonly botHandlerClient: ClientProxy
  ) {}

  @MessagePattern('bot.identifier.created')
  botIdentifierCreated(id: string) {
    this.appService.setOrUpdateMachineStatus(id, {
      count: 0,
      users: [],
    });
  }

  @MessagePattern('bot.identifier.destroyed')
  botIdentifierDestroyed(id: string) {
    this.appService.removeMachineStatus(id);
  }

  @MessagePattern(BotPatterns.BOT_STATUS_RESPONSE)
  botStatus({ identifier, status }: BotGetStatusResponse) {
    this.appService.setOrUpdateMachineStatus(identifier, status);
  }

  @EventPattern('user.online')
  async userOnline(channelName: string) {
    const botId =
      this.appService.preassignMachineToUser(channelName);
    if (!botId) return 'NOT_JOINED';
    const { status } = await lastValueFrom(
      this.botHandlerClient.send<BotConnectChannelResponse>(
        BotPatterns.BOT_CONNECT_CHANNEL,
        { channelName, botId }
      )
    );
    this.appService.setOrUpdateMachineStatus(botId, status);
    return 'OK';
  }

  @MessagePattern('user.offline')
  async userOffline(channelName: string) {
    const { identifier, count } = await lastValueFrom(
      this.botHandlerClient.send('bot:disconnect:channel', { channelName })
    );
    this.appService.setOrUpdateMachineStatus(identifier, count);
    return 'OK';
  }

  // @MessagePattern('user.banned')
  // userBanned({
  //   streamerId,
  //   bannedId,
  // }: {
  //   streamerId: string;
  //   bannedId: string;
  // }) {}

  // @MessagePattern('user.unbanned')
  // userUnbanned({
  //   streamerId,
  //   bannedId,
  // }: {
  //   streamerId: string;
  //   bannedId: string;
  // }) {}
}
