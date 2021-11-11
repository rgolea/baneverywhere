import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { BotDatabaseModule } from "@baneverywhere/db";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    SettingsModule,
    BotDatabaseModule
  ],
})
export class AppModule {}
