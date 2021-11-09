import { BOT_CONNECTION } from '@baneverywhere/namespaces';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AppService } from './app.service';
import { v4 as uuidv4 } from "uuid";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(BOT_CONNECTION) private readonly botHandlerClient: ClientProxy
  ) {}

  @MessagePattern('bot.identifier.created')
  botIdentifierCreated(id: string) {
    this.appService.setOrUpdateMachineStatus(id, 0);
  }

  @MessagePattern('bot.identifier.destroyed')
  botIdentifierDestroyed(id: string) {
    this.appService.removeMachineStatus(id);
  }

  @MessagePattern('bot:status')
  botStatus({ identifier, count }: { identifier: string; count: number }) {
    this.appService.setOrUpdateMachineStatus(identifier, count);
  }

  @MessagePattern('user.online')
  async userOnline(channelName: string) {
    const [ botId ] = this.appService.getMachineWithLowerStatus();
    const { count }: { count: number } = await lastValueFrom(
      this.botHandlerClient.send('bot:connect:channel', { channelName, botId })
    );
    this.appService.setOrUpdateMachineStatus(botId, count);
    this.botHandlerClient.emit('bot:get:status', { status: 'online', id: uuidv4() });
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
