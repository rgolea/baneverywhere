import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { BOT_IDENTIFIER } from './bot.identifier';
import { v4 as uuidv4 } from 'uuid';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { BOT_HANDLER_CONNECTION } from '@baneverywhere/namespaces';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BotClientModule } from "./bot-client/bot-client.module";
import { environment } from '../environments/environment';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: BOT_HANDLER_CONNECTION,
        transport: Transport.REDIS,
        options: { url: 'redis://localhost:6379' },
      },
    ]),
    BotClientModule.forRoot({
      debug: !environment.production,
      username: process.env.BAN_BOT_USER,
      password: process.env.BAN_BOT_PASSWORD,
    })
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
    private readonly configService: ConfigService,
    @Inject(BOT_HANDLER_CONNECTION)
    private readonly botHandlerClient: ClientProxy,
  ) {}

  onModuleInit() {
    this.botHandlerClient.emit('bot.identifier.created', this.botIdentifier);
  }

  onModuleDestroy() {
    this.botHandlerClient.emit('bot.identifier.destroyed', this.botIdentifier);
  }
}
