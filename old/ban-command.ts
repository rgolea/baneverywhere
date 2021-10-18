import { CommandExecutor, CommandOrigins } from "tmijs-commander";
import { channelToUsername } from "./utils/converters";

export class BanCommand extends CommandExecutor {
  public async invoke({ author, channel, client, arguments: args}: CommandOrigins): Promise<void> {
    if(!author.mod && author.username !== channelToUsername(channel, '')) return;
    const [ user, ...reasonArr ] = args;
    const channels = client.getChannels();
    try {
      await Promise.all(channels.map(async ch => {
        return await client.ban(ch, user, `${reasonArr.join(' ')}`);
      }));
    } catch(err){
      client.say(channel, `There was an unexpected error`);
    }
  }
}
