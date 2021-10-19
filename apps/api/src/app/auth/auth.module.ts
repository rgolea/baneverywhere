import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule, UsersModule],
  controllers: [AuthController]
})
export class AuthModule {}
