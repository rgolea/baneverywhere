import { CommandExecutor, CommandOrigins } from 'tmijs-commander';
import { logError } from '@baneverywhere/error-handler';
import { BanEverywhereSettings } from '@prisma/client';
import { channelToUsername, Validate } from '../utils';
import { Queue } from 'bull';

export class SettingsCommand extends CommandExecutor {
  constructor(private readonly queue: Queue) {
    super();
  }

  @Validate({
    MODERATOR: true,
    STREAMER: true,
  })
  @logError()
  public async invoke({
    channel,
    client,
    arguments: args
  }: CommandOrigins): Promise<void> {
    const [streamer, settings] = args;
    if(!Object.values(BanEverywhereSettings).includes(settings as BanEverywhereSettings)) {
      client.say(channel, `${settings} is not a valid setting. Please use one of the following: ${Object.values(BanEverywhereSettings).join(', ')}`);
    } else {
      client.say(channel, `Assigning setting ${settings} to ${streamer}`);
      this.queue.add('settings', {
        channelName: channelToUsername(channel, ''),
        settings,
        username: channelToUsername(streamer, '')
      } as {
        channelName: string;
        settings: BanEverywhereSettings;
        username: string;
      })
    }
  }
}
