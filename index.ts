import { Client } from "tmi.js";
import { Commander } from "tmijs-commander";
import { BanCommand } from "./ban-command";
import { JoinCommand } from "./join-command";

const client = new Client({
	options: { debug: true },
	identity: {
		username: '<USERNAME>',
		password: 'oauth:<PASSWORD>' //OBTAIN PASSWORD: http://twitchapps.com/tmi/
	},
	channels: [ '<channels>' ]
});

client.connect().then(() => {
  const commander = new Commander(client);
  commander.registerCommand('!ban*', new BanCommand());
  commander.registerCommand('!baneverywhere', new BanCommand());
  commander.registerCommand('!joinban*', new JoinCommand());
  commander.registerCommand('!joinbaneverywhere', new JoinCommand());
}).catch(console.error);
