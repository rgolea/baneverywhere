import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TwitchStrategy } from './strategies/twitch.strategy';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfigFactory } from './db/mongodb-config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PassportModule.register({
      session: true,
      property: 'user'
    }),
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongooseConfigFactory,
      inject: [ConfigService]
    })
  ],
  providers: [TwitchStrategy]
})
export class AppModule {}
