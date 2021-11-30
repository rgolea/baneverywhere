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
import { channelToUsername } from './utils';
import { PingCommand } from './commands/ping-command';
import { logError } from '@baneverywhere/error-handler';

@Injectable()
export class BotClientService implements OnModuleInit {
  constructor(
    @Inject(BAN_BOT) private readonly client: Client,
    @InjectQueue('queue') private readonly queue: Queue
  ) {}

  @logError()
  async onModuleInit() {
    const commander = new Commander(this.client);
    commander.registerCommand('!ban*', new BanCommand(this.queue));
    commander.registerCommand('!unban*', new UnbanCommand(this.queue));
    commander.registerCommand('!ping*', new PingCommand());
  }

  @logError()
  async joinChannel(channel: string) {
    await this.client.join(channel);
    if (
      channel !== this.client.getUsername() &&
      !this.client.isMod(channel, this.client.getUsername())
    ) {
      this.client.say(channel, `I need to be a moderator @${channel}`);
    }
    this.client.say(channel, `I'm here @${channel}, sorry for the delay`);
    return this.getStatus();
  }

  @logError()
  async leaveChannel(channel: string) {
    await this.client.part(channel);
    return this.getStatus();
  }

  @logError()
  getStatus(): BotStatus {
    const users = this.client.getChannels() || [];
    return {
      count: users?.length || 0,
      users,
    };
  }

  @logError()
  banUser(channel: string, action: Actions) {
    this.client.ban(channel, action.user, action.reason);
  }

  @logError()
  unbanUser(channel: string, action: Actions) {
    this.client.unban(channel, action.user);
  }

  @logError()
  sendToAll(message: string) {
    this.client
      .getChannels()
      .forEach((channel) =>
        this.client.say(
          channel,
          `${channelToUsername(channel)} -> Important: ${message}`
        )
      );
  }
}
