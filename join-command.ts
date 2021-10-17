import { CommandExecutor, CommandOrigins } from "tmijs-commander";
import { channelToUsername } from "./utils/converters";

export class JoinCommand extends CommandExecutor {
  public async invoke({ channel, client}: CommandOrigins): Promise<void> {
    if(!client.isMod(channel, client.getUsername())) {
      client.say(channel, `${channelToUsername(channel)} you need to make me mod! 😢`);
    } else {
      client.join(channel);
    }
  }
}
