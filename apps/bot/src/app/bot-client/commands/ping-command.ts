import { logError } from '@baneverywhere/error-handler';
import { CommandExecutor, CommandOrigins } from 'tmijs-commander';
import { channelToUsername } from "../utils";

export class PingCommand extends CommandExecutor {

  @logError()
  public async invoke({
    channel,
    client,
    author
  }: CommandOrigins): Promise<void> {
    if (!author.mod && author.username !== channelToUsername(channel, ''))
      return;
    client.say(channel, 'pong');
  }
}
