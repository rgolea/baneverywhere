import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { twitchClientAccessTokenFactory } from './twitch-client-access-token.factory';
import { AxiosResponse } from "axios";
import { of } from 'rxjs';
import { HttpStatus } from '@nestjs/common';

describe('TwitchClientAccessToken', () => {
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
    }).compile();

    http = module.get<HttpService>(HttpService);
  });

  it('should call twitch to obtain the access token', async () => {
    const ACCESS_TOKEN = 'access_token';
    const response: AxiosResponse<{ access_token: string }> = {
      data: {
        access_token: ACCESS_TOKEN,
      },
      headers: {},
      statusText: HttpStatus.OK.toString(),
      status: 200,
      config: {},
    };

    const request = jest.spyOn(http, 'post').mockImplementation(() => of(response));

    const twitchClientAccessToken = await twitchClientAccessTokenFactory(http, {
      clientID: 'test',
      clientSecret: 'test',
    });

    expect(twitchClientAccessToken).toBeDefined();
    expect(twitchClientAccessToken).toBe(ACCESS_TOKEN);
    expect(request).toHaveBeenCalledWith('https://id.twitch.tv/oauth2/token?client_id=test&client_secret=test&grant_type=client_credentials');
  });
});
