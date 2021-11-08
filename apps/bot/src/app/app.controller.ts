import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BOT_IDENTIFIER } from "./bot.identifier";

@Controller('app')
export class AppController {
  constructor(
    @Inject(BOT_IDENTIFIER) private readonly botIdentifier: string
  ) {}

  @MessagePattern('bot:get:status')
  getStatus() {
    return {
      identifier: this.botIdentifier,
      users: []
    };
  }

  @MessagePattern('bot:connect:channel')
  connectToChannel({ channelName, botId }: { channelName: string, botId: string }){
    if(botId !== this.botIdentifier) return;
    console.log(`Connecting to channel ${channelName}`);
  }

  @MessagePattern('bot:disconnect:channel')
  disconnectFromChannel({ channelName }: { channelName: string }){
    console.log(`Disconnecting from channel ${channelName}`);
  }

}
