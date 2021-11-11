import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { TwitchClientOptions } from './twitch-client.options';
import { TWITCH_CLIENT_ACCESS_TOKEN, TWITCH_CLIENT_OPTS } from './twitch-client.token';

@Injectable()
export class TwitchClientService {
  constructor(
    @Inject(TWITCH_CLIENT_ACCESS_TOKEN) private readonly accessToken: string,
    @Inject(TWITCH_CLIENT_OPTS) private readonly opts: TwitchClientOptions,
    private readonly http: HttpService,
  ) {}

  public async findUsername(id: string){
    const { data } = await lastValueFrom(
      this.http.get<{data: Array<{ login: string }>}>(
        `https://api.twitch.tv/helix/users?id=${id}`,
        {
          headers: {
            'Client-ID': this.opts.clientID,
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      )
    );

    return data.data[0].login;
  }
}
