import { CommandExecutor, CommandOrigins } from 'tmijs-commander';
import { channelToUsername } from '../utils';
import { Action } from '@prisma/client';
import { Queue } from 'bull';

export class UnbanCommand extends CommandExecutor {
  constructor(private readonly queue: Queue) {
    super();
  }
  public async invoke({
    author,
    channel,
    client,
    arguments: args,
  }: CommandOrigins): Promise<void> {
    console.log(author, channel, client, args);
    if (!author.mod && author.username !== channelToUsername(channel, ''))
      return;
    const [user] = args;

    await client
      .unban(channel, user)
      .catch(() => client.say(channel, `Could not perform operation`));
    client.say(channel, `${user} has been unbanned.`);
    this.queue.add(Action.UNBAN, {
      action: Action.UNBAN,
      moderator: author.username,
      streamer: channelToUsername(channel),
      user: user,
    });
  }
}
