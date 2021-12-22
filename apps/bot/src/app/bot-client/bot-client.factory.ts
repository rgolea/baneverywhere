import { Client } from 'tmi.js';
import { BotClientOptions } from './bot-client.options';

export async function botClientFactory(
  opts: BotClientOptions
): Promise<Client> {

  const client = new Client({
    options: {
      debug: opts.debug,
      skipMembership: true,
      skipUpdatingEmotesets: true
    },
    identity: {
      username: opts.username,
      password: `oauth:${opts.accessToken}`,
    },
    channels: ['rgolea']
  });

  await client.connect().catch(err => console.error(err));

  return client;
}
