import { CommandExecutor, CommandOrigins } from 'tmijs-commander';
import { channelToUsername } from '../utils';
import { Action } from '@prisma/client';
import { Queue } from 'bull';
import { logError } from '@baneverywhere/error-handler';
export class BanCommand extends CommandExecutor {
  constructor(private readonly queue: Queue) {
    super();
  }

  @logError()
  public async invoke({
    author,
    channel,
    client,
    arguments: args,
  }: CommandOrigins): Promise<void> {
    if (!author.mod && author.username !== channelToUsername(channel, ''))
      return;
    const [user, ...reasonArr] = args;
    if (!reasonArr.filter(Boolean).length) {
      client.say(channel, `Please insert a reason for banning this user.`);
      return;
    }
    const reason = `${channelToUsername(channel)}: ${reasonArr.join(
      ' '
    )} - by ${author.username}`;

    await client
      .ban(channel, user, reason)
      .then(() =>
        client.say(
          channel,
          `Banned ${user}. I sent the request to the streamers that follow you.`
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

    await this.queue.add(Action.BAN, {
      action: Action.BAN,
      moderator: author.username,
      streamer: channelToUsername(channel),
      user: user,
      reason,
    });
  }
}
