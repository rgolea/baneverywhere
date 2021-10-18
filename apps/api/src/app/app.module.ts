import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TwitchStrategy } from './strategies/twitch.strategy';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PassportModule.register({
      session: true,
      property: 'user'
    }),
    AuthModule
  ],
  providers: [TwitchStrategy]
})
export class AppModule {}
