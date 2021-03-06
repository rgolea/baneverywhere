import { CommandExecutor, CommandOrigins } from 'tmijs-commander';
import { channelToUsername, Validate } from '../utils';
import { Action } from '@prisma/client';
import { Queue } from 'bull';
import { logError } from '@baneverywhere/error-handler';

export class UnbanCommand extends CommandExecutor {
  constructor(private readonly queue: Queue) {
    super();
  }

  @Validate({
    MODERATOR: true,
    STREAMER: true,
  })
  @logError()
  public async invoke({
    author,
    channel,
    client,
    arguments: args,
  }: CommandOrigins): Promise<void> {
    const [user] = args;

    await client
      .unban(channel, user)
      .then(() =>
        client.say(
          channel,
          `Unbanned ${user}. I sent the request to the streamers that follow you.`
        )
      )
      .catch((err) => {
        console.log(err);
        if (!client.isMod(channel, client.getUsername())) {
          client.say(
            channel,
            `Could not ban ${user} because I am not yet a mod`
          );
        }
        {
          client.say(
            channel,
            `${user} might already be banned. I sent the request to the streamers that follow you.`
          );
        }
      });

    this.queue.add(Action.UNBAN, {
      action: Action.UNBAN,
      moderator: author.username,
      streamer: channelToUsername(channel),
      user: user,
    });
  }
}
