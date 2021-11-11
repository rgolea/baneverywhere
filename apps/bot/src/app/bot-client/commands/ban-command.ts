import { CommandExecutor, CommandOrigins } from 'tmijs-commander';
import { channelToUsername } from '../utils';
import { Action } from '@prisma/client';
import { Queue } from 'bull';
export class BanCommand extends CommandExecutor {
  constructor(private readonly queue: Queue) {
    super();
  }
  public async invoke({
    author,
    channel,
    client,
    arguments: args,
  }: CommandOrigins): Promise<void> {
    if (!author.mod && author.username !== channelToUsername(channel, ''))
      return;
    const [user, ...reasonArr] = args;
    const reason = `${channelToUsername(channel)}: ${reasonArr.join(
      ' '
    )} - by ${author.username}`;

    await client
      .ban(channel, user, reason)
      .catch((err) => {
        console.log(err);
        client.say(channel, `Could not perform operation`)
      });
    client.say(channel, `${user} has been banned.`);
    await this.queue.add(Action.BAN, {
      action: Action.BAN,
      moderator: author.username,
      streamer: channelToUsername(channel),
      user: user,
      reason,
    });
  }
}
