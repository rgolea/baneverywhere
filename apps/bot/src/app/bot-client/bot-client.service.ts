import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'tmi.js';
import { Commander } from 'tmijs-commander';
import { BAN_BOT } from './bot-client.tokens';
import { BanCommand } from './commands/ban-command';
import { BotStatus } from '@baneverywhere/bot-interfaces';

@Injectable()
export class BotClientService implements OnModuleInit {
  constructor(@Inject(BAN_BOT) private readonly client: Client) {}

  async onModuleInit() {
    const commander = new Commander(this.client);
    commander.registerCommand('!ban*', new BanCommand());
  }

  async joinChannel(channel: string) {
    await this.client.join(channel);
    return this.getStatus();
  }

  async leaveChannel(channel: string) {
    await this.client.part(channel);
    return this.getStatus();
  }

  getStatus(): BotStatus {
    const users = this.client.getChannels();
    return {
      count: users.length,
      users
    };
  }
}
