import { CommandExecutor, CommandOrigins } from 'tmijs-commander';
import { channelToUsername } from '../utils';
import { Action } from '@prisma/client';
import { Queue } from 'bull';
import { logError } from '@baneverywhere/error-handler';

export class UnbanCommand extends CommandExecutor {
  constructor(private readonly queue: Queue) {
    super();
  }

  @logError()
  public async invoke({
    author,
    channel,
    client,
    arguments: args,
  }: CommandOrigins): Promise<void> {;
    if (!author.mod && author.username !== channelToUsername(channel, ''))
      return;
    const [user] = args;

    await client
      .unban(channel, user)
      .catch((err) => {
        console.log(err);
        if(!client.isMod(channel, client.getUsername())) {
          client.say(channel, `Could not ban ${user} because I am not yet a mod`);
        } {
          client.say(channel, `${user} might already be banned. I sent the request to the streamers that follow you.`);
        }
      });
    client.say(channel, `${user} has been unbanned.`);
    this.queue.add(Action.UNBAN, {
      action: Action.UNBAN,
      moderator: author.username,
      streamer: channelToUsername(channel),
      user: user,
    });
  }
}
