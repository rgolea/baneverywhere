import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BOT_CONNECTION } from '@baneverywhere/namespaces';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotDatabaseModule } from '@baneverywhere/db';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule,
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
    BotDatabaseModule,
    BullModule.registerQueueAsync({
      name: 'queue',
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
