import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BotDatabaseModule } from "@baneverywhere/db";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BOT_HANDLER_CONNECTION } from "@baneverywhere/namespaces";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BotDatabaseModule,
    ConfigModule.forRoot(),
    HttpModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            url: `redis://${config.get('REDIS_HOST', 'localhost')}:${config.get('REDIS_PORT', 6379)}`,
          }
        }),
        inject: [ConfigService],
        name: BOT_HANDLER_CONNECTION,
      },
    ])
  ],
  providers: [AppService],
})
export class AppModule {}
