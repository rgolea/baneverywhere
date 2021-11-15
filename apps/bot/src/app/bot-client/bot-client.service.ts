import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'tmi.js';
import { Commander } from 'tmijs-commander';
import { BAN_BOT } from './bot-client.tokens';
import { BanCommand } from './commands/ban-command';
import { UnbanCommand } from './commands/unban-command';
import { BotStatus } from '@baneverywhere/bot-interfaces';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Actions } from '@prisma/client';

@Injectable()
export class BotClientService implements OnModuleInit {
  constructor(
    @Inject(BAN_BOT) private readonly client: Client,
    @InjectQueue('queue') private readonly queue: Queue
  ) {}

  async onModuleInit() {
    const commander = new Commander(this.client);
    commander.registerCommand('!ban*', new BanCommand(this.queue));
    commander.registerCommand('!unban*', new UnbanCommand(this.queue));
  }

  async joinChannel(channel: string) {
    await this.client.join(channel);
    if (
      channel !== this.client.getUsername() &&
      !this.client.isMod(channel, this.client.getUsername())
    ) {
      this.client.say(channel, `I need to be a moderator @${channel}`);
    }
    this.client.say(channel, `I'm here @${channel}`);
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
      users,
    };
  }

  banUser(channel: string, action: Actions) {
    this.client.ban(channel, action.user, action.reason);
  }

  unbanUser(channel: string, action: Actions) {
    this.client.unban(channel, action.user);
  }
}
