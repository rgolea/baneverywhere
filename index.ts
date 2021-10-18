import { Client } from "tmi.js";
import { Commander } from "tmijs-commander";
import { BanCommand } from "./ban-command";
import { JoinCommand } from "./join-command";
import { config } from 'dotenv';

config();

const client = new Client({
	options: { debug: true },
	identity: {
		username: process.env.BAN_BOT_USER,
		password: process.env.BAN_BOT_PASSWORD //OBTAIN PASSWORD: http://twitchapps.com/tmi/
	},
	channels: [ 'rgolea' ]
});

client.connect().then(() => {
  const commander = new Commander(client);
  commander.registerCommand('!ban*', new BanCommand());
  commander.registerCommand('!baneverywhere', new BanCommand());
  commander.registerCommand('!joinban*', new JoinCommand());
  commander.registerCommand('!joinbaneverywhere', new JoinCommand());
}).catch(console.error);
