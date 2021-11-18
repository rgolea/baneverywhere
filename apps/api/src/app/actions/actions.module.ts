import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'queue',
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
        }
      }),
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
  ],
  controllers: [ActionsController],
  providers: [ActionsService],
})
export class ActionsModule {}
