import { Module } from '@nestjs/common';
import { BullModule } from "@nestjs/bull";
import { QueueProcessor } from './queue-processor';
import { BotDatabaseModule } from "@baneverywhere/db";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BOT_CONNECTION } from "@baneverywhere/namespaces";

@Module({
  imports: [
    ConfigModule.forRoot(),
    BotDatabaseModule,
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
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            url: `redis://${config.get('REDIS_HOST', 'localhost')}:${config.get('REDIS_PORT', 6379)}`,
          }
        }),
        inject: [ConfigService],
        name: BOT_CONNECTION,
      },
    ]),
  ],
  providers: [QueueProcessor]
})
export class AppModule {}
