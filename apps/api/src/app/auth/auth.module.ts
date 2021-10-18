import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule],
  controllers: [AuthController]
})
export class AuthModule {}
