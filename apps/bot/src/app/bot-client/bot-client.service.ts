import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'tmi.js';
import { Commander } from 'tmijs-commander';
import { BAN_BOT_DEBUG, BAN_BOT_USER, BAN_BOT_PASSWORD } from './bot-client.tokens';
import { BanCommand } from './commands/ban-command';

@Injectable()
export class BotClientService implements OnModuleInit {
  private client: Client;

  constructor(
    @Inject(BAN_BOT_DEBUG) private readonly debug: boolean,
    @Inject(BAN_BOT_USER) private readonly username: string,
    @Inject(BAN_BOT_PASSWORD) private readonly password: string
  ) {}

  async onModuleInit() {
    this.client = new Client({
      options: { debug: this.debug },
      identity: {
        username: this.username,
        password: this.password, //OBTAIN PASSWORD: http://twitchapps.com/tmi/
      }
    });

    try {
      await this.client.connect();
      const commander = new Commander(this.client);
      commander.registerCommand('!ban*', new BanCommand());
    } catch (error) {
      console.error('Error connecting to Twitch:', error);
    }
  }

  joinChannel(channel: string) {
    return this.client.join(channel);
  }

  leaveChannel(channel: string) {
    return this.client.part(channel);
  }
}
