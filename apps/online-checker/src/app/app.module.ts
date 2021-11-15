import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BotDatabaseModule } from "@baneverywhere/db";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BOT_HANDLER_CONNECTION } from "@baneverywhere/namespaces";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BotDatabaseModule,
    ConfigModule.forRoot(),
    HttpModule,
    ClientsModule.register([
      {
        name: BOT_HANDLER_CONNECTION,
        transport: Transport.REDIS,
        options: { url: 'redis://localhost:6379' },
      },
    ])
  ],
  providers: [AppService],
})
export class AppModule {}
