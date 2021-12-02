import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BotDatabaseModule } from "@baneverywhere/db";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { BOT_CONNECTION } from "@baneverywhere/namespaces";
import { TwitchClientModule } from "@baneverywhere/twitch-client";
import { BullModule } from "@nestjs/bull";
@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    BotDatabaseModule,
    ClientsModule.register([]),
    TwitchClientModule.forRootAsync({
      useFactory: (config) => ({
        clientID: config.get('TWITCH_CLIENT_ID'),
        clientSecret: config.get('TWITCH_CLIENT_SECRET'),
      }),
      inject: [ConfigService],
      imports: [ConfigModule]
    }),
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
  providers: [AppService, {
    provide: BOT_CONNECTION,
    useFactory: (config: ConfigService) => {
      return ClientProxyFactory.create({
        transport: Transport.REDIS,
        options: {
          url: `redis://${config.get('REDIS_HOST', 'localhost')}:${config.get('REDIS_PORT', 6379)}`,
        }
      })
    },
    inject: [ConfigService]
  }],
})
export class AppModule {
}
