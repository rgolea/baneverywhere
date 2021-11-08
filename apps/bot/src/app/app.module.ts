import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BotProcessor } from './bot.processor';


@Module({
  imports: [
    BullModule.registerQueue({
      name: 'bot',
      redis: {
        host: 'localhost',
        port: 6379,
      }
    })
  ],
  providers: [BotProcessor],
})
export class AppModule {}
