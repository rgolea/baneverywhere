import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { BOT_IDENTIFIER } from './bot.identifier';
import { v4 as uuidv4 } from 'uuid';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotClientModule } from './bot-client/bot-client.module';
import { environment } from '../environments/environment';
import { BullModule } from '@nestjs/bull';
import { BotClientService } from './bot-client/bot-client.service';
import { BotDatabaseModule, BotDatabaseService } from '@baneverywhere/db';
import { logError } from '@baneverywhere/error-handler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BotClientModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          debug: !environment.production,
          username: configService.get('BAN_BOT_USER'),
          accessToken: configService.get('TWITCH_CLIENT_ACCESS_TOKEN'),
        };
      },
      imports: [
        ConfigModule,
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
    }),
    BotDatabaseModule,
  ],
  providers: [
    {
      provide: BOT_IDENTIFIER,
      useValue: uuidv4(),
    },
  ],
  controllers: [AppController],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(BOT_IDENTIFIER) private readonly botIdentifier: string,
    private readonly dbService: BotDatabaseService,
    private readonly botClientService: BotClientService,
  ) {}

  @logError()
  async onModuleInit() {
    await this.dbService.machine.create({
      data: {
        uuid: this.botIdentifier,
      },
    });
  }

  @logError()
  async onModuleDestroy() {
    this.botClientService.sendToAll('Restarting service');
    await this.dbService.user.updateMany({
      where: {
        machineUUID: this.botIdentifier,
      },
      data: {
        machineUUID: null,
      },
    });
    await this.dbService.machine.delete({
      where: {
        uuid: this.botIdentifier,
      },
    });
  }
}
