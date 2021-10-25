import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [PassportModule, UsersModule, CoreModule],
  controllers: [AuthController],
})
export class AuthModule {}
