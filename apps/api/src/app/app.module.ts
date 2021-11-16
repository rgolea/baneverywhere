import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { BotDatabaseModule } from "@baneverywhere/db";
import { ActionsModule } from "./actions/actions.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    SettingsModule,
    BotDatabaseModule,
    ActionsModule
  ],
})
export class AppModule {}
