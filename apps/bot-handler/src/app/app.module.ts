import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from "@nestjs/bull";
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { BOT_CONNECTION } from "@baneverywhere/namespaces";
import { v4 as uuidv4 } from "uuid";
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: 'bot',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ClientsModule.register([
      {
        name: BOT_CONNECTION,
        transport: Transport.REDIS,
        options: { url: 'redis://localhost:6379' },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    @Inject(BOT_CONNECTION) private readonly botHandlerClient: ClientProxy,
  ) {
  }

  onApplicationBootstrap() {
    setTimeout(() => {
      this.botHandlerClient.emit('bot:get:status', { status: 'online', id: uuidv4() });
    }, 1000);
  }
}
