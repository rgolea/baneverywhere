import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { BOT_CONNECTION } from '@baneverywhere/namespaces';
import { v4 as uuidv4 } from 'uuid';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotPatterns } from '@baneverywhere/bot-interfaces';
import { BotDatabaseModule, BotDatabaseService } from '@baneverywhere/db';
import { BullModule } from '@nestjs/bull';
import { logError } from '@baneverywhere/error-handler';

@Module({
  imports: [
    ConfigModule,
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
        name: BOT_CONNECTION,
      },
    ]),
    BotDatabaseModule,
    BullModule.registerQueueAsync({
      name: 'queue',
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    @Inject(BOT_CONNECTION) private readonly botHandlerClient: ClientProxy,
    private readonly dbService: BotDatabaseService
  ) {}

  @logError()
  async onApplicationBootstrap() {
    await this.dbService.channels.deleteMany({});
    setTimeout(() => {
      this.botHandlerClient.emit<void, unknown>(
        BotPatterns.BOT_GET_STATUS,
        uuidv4()
      );
    }, 1000);
  }
}
