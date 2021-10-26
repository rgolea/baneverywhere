import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwitchStrategy } from './strategies/twitch.strategy';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60d', issuer: '', keyid: '' },
    }),
    PassportModule.register({
      session: true,
      property: 'user',
      defaultStrategy: 'jwt'
    }),
  ],
  providers: [JwtStrategy, TwitchStrategy],
  exports: [PassportModule, JwtModule]
})
export class CoreModule {};
