import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BotDatabaseModule } from "@baneverywhere/db";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BOT_HANDLER_CONNECTION } from "@baneverywhere/namespaces";
import { TwitchClientModule } from "@baneverywhere/twitch-client";
console.log(ConfigModule);
@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    BotDatabaseModule,
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
        name: BOT_HANDLER_CONNECTION,
      },
    ]),
    TwitchClientModule.forRootAsync({
      useFactory: (config) => ({
        clientID: config.get('TWITCH_CLIENT_ID'),
        clientSecret: config.get('TWITCH_CLIENT_SECRET'),
      }),
      inject: [ConfigService],
      imports: [ConfigModule]
    })
  ],
  providers: [AppService],
})
export class AppModule {}
