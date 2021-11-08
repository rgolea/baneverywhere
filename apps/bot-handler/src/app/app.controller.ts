import { Controller } from '@nestjs/common';
// import { MessagePattern } from '@nestjs/microservices';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller()
export class AppController {
  constructor(@InjectQueue('bot') private readonly botQueue: Queue) {
    this.botQueue.add('ban', {twitchId: 'someId'}).then((job) => console.log(job.id));
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
