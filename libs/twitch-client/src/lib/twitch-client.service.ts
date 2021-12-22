import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { TwitchClientOptions } from './twitch-client.options';
import {
  TWITCH_CLIENT_OPTS,
} from './twitch-client.token';
import { logError } from '@baneverywhere/error-handler';

@Injectable()
export class TwitchClientService {
  constructor(
    @Inject(TWITCH_CLIENT_OPTS) private readonly opts: TwitchClientOptions,
    private readonly http: HttpService
  ) {}

  async getAccessToken() {
    const { data } = await lastValueFrom(
      this.http.post<{ access_token: string }>(
        `https://id.twitch.tv/oauth2/token?client_id=${this.opts.clientID}&client_secret=${this.opts.clientSecret}&grant_type=client_credentials`
      )
    );
    return data.access_token;
  }

  @logError()
  public async findUsername(id: string) {
    const accessToken = await this.getAccessToken();
    const { data } = await lastValueFrom(
      this.http.get<{ data: Array<{ login: string }> }>(
        `https://api.twitch.tv/helix/users?id=${id}`,
        {
          headers: {
            'Client-ID': this.opts.clientID,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
    );

    return data.data[0].login;
  }

  @logError()
  public async findUsernamesByLogin(logins: string[]) {
    const accessToken = await this.getAccessToken();
    const url = `https://api.twitch.tv/helix/users?login=${logins.join('&login=')}`;

    const { data } = await lastValueFrom(
      this.http.get<{ data: Array<{ id: string, login: string }> }>(
        url,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Client-Id': this.opts.clientID,
          },
        }
      )
    );

    return data.data;
  }

  @logError()
  public async checkUsersStatus(logins: string[]) {
    const accessToken = await this.getAccessToken();

    const url = `https://api.twitch.tv/helix/streams?user_login=${logins.join(
      '&user_login='
    )}`;

    return await lastValueFrom(
      this.http.get<{ data: Array<{ user_login: string; type: string }> }>(
        url,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Client-Id': this.opts.clientID,
          },
        }
      )
    );
  }
}
