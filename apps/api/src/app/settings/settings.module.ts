import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwitchClientModule } from "@baneverywhere/twitch-client";

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    TwitchClientModule.forRootAsync({
      useFactory: (config) => ({
        clientID: config.get('TWITCH_CLIENT_ID'),
        clientSecret: config.get('TWITCH_CLIENT_SECRET'),
      }),
      inject: [ConfigService],
      imports: [ConfigModule]
    })
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
