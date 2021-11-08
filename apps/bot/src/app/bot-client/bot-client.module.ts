import { DynamicModule, Module } from '@nestjs/common';
import {
  BAN_BOT_DEBUG,
  BAN_BOT_PASSWORD,
  BAN_BOT_USER,
} from './bot-client.tokens';
import { BotClientService } from './bot-client.service';

@Module({
  providers: [BotClientService]
})
export class BotClientModule {
  static forRoot({
    debug,
    username,
    password,
  }: {
    debug?: boolean;
    username: string;
    password: string;
  }): DynamicModule {
    console.log(username);
    return {
      module: BotClientModule,
      imports: [],
      exports: [BotClientService],
      providers: [
        {
          provide: BAN_BOT_DEBUG,
          useValue: Boolean(debug),
        },
        {
          provide: BAN_BOT_USER,
          useValue: username || '',
        },
        {
          provide: BAN_BOT_PASSWORD,
          useValue: password || '',
        },
      ],
    };
  }
}
