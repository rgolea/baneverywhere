import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfigFactory } from './db/mongodb-config';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongooseConfigFactory,
      inject: [ConfigService]
    }),
    SettingsModule
  ]
})
export class AppModule {}
