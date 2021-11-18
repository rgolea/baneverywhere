import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { BOT_IDENTIFIER } from './bot.identifier';
import { v4 as uuidv4 } from 'uuid';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { BOT_HANDLER_CONNECTION } from '@baneverywhere/namespaces';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotClientModule } from './bot-client/bot-client.module';
import { environment } from '../environments/environment';
import { BullModule } from '@nestjs/bull';
import { BotClientService } from './bot-client/bot-client.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    ]),
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
    @Inject(BOT_HANDLER_CONNECTION)
    private readonly botHandlerClient: ClientProxy,
    private readonly botService: BotClientService,
  ) {}

  onModuleInit() {
    this.botHandlerClient.emit('bot.identifier.created', this.botIdentifier);
  }

  onModuleDestroy() {
    this.botHandlerClient.emit('bot.identifier.destroyed', this.botIdentifier);
    this.botService.sendToAll('Restarting service');
  }
}
