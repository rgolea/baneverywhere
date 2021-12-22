import { logError } from '@baneverywhere/error-handler';
import { CommandExecutor, CommandOrigins } from 'tmijs-commander';
import { Validate } from '../utils';

export class PingCommand extends CommandExecutor {
  @Validate({
    MODERATOR: true,
    STREAMER: true,
    USER: (author: CommandOrigins['author']) =>
      ['rgolea'].includes(author.username),
  })
  @logError()
  public async invoke({
    channel,
    client,
  }: CommandOrigins): Promise<void> {
    client.say(channel, 'ping');
  }
}
