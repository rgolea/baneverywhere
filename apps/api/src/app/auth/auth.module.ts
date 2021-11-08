import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { CoreModule } from '../core/core.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BOT_HANDLER } from '@baneverywhere/namespaces';

@Module({
  imports: [PassportModule, UsersModule, CoreModule, ClientsModule.register([
    {
      name: BOT_HANDLER,
      transport: Transport.REDIS,
      options: { url: 'redis://localhost:6379' },
    },
  ]),],
  controllers: [AuthController],
})
export class AuthModule {}
