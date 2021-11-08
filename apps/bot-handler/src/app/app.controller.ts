import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {

  @MessagePattern('bot.identifier.created')
  botIdentifierCreated(id: string) {
    console.log('bot.identifier.created', id);
  }

  @MessagePattern('bot.identifier.destroyed')
  botIdentifierDestroyed(id: string) {
    console.log('bot.identifier.destroyed', id);
  }
  // @MessagePattern('user.online')
  // userOnline(twitchId: string) {}

  // @MessagePattern('user.offline')
  // userOffline(twitchId: string) {}

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
