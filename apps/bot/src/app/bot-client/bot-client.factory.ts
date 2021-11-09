import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Client } from 'tmi.js';
import { BotClientOptions } from './bot-client.options';

export async function botClientFactory(
  httpService: HttpService,
  opts: BotClientOptions
): Promise<Client> {
  const { data } = await lastValueFrom(
    httpService.post<{ access_token: string }>(
      `${
        opts.twitchOAuthURL || 'https://id.twitch.tv/oauth2/token'
      }?client_id=${opts.clientId}&client_secret=${
        opts.clientSecret
      }&grant_type=client_credentials`
    )
  );

  const client = new Client({
    options: {
      debug: opts.debug,
    },
    identity: {
      username: opts.username,
      password: `oauth:${data.access_token}`,
    }
  });

  await client.connect();

  return client;
}
