import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'tmi.js';
import { Commander } from 'tmijs-commander';
import { BAN_BOT } from './bot-client.tokens';
import { BanCommand } from './commands/ban-command';

@Injectable()
export class BotClientService implements OnModuleInit {
  constructor(@Inject(BAN_BOT) private readonly client: Client) {}

  async onModuleInit() {
    const commander = new Commander(this.client);
    commander.registerCommand('!ban*', new BanCommand());
  }

  joinChannel(channel: string) {
    return this.client.join(channel);
  }

  leaveChannel(channel: string) {
    return this.client.part(channel);
  }

  getStatus(): number {
    return this.client.getChannels().length;
  }
}
