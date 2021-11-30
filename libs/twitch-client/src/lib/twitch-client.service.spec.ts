import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { TwitchClientOptions } from './twitch-client.options';
import { TwitchClientService } from './twitch-client.service';
import { TWITCH_CLIENT_ACCESS_TOKEN, TWITCH_CLIENT_OPTS } from './twitch-client.token';

describe('TwitchClientService', () => {
  let service: TwitchClientService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [{
        provide: TWITCH_CLIENT_OPTS,
        useValue: {
          clientID: 'test',
          clientSecret: 'test'
        } as TwitchClientOptions
      }, {
        provide: TWITCH_CLIENT_ACCESS_TOKEN,
        useValue: 'access_token'
      }, TwitchClientService],
    }).compile();

    service = module.get<TwitchClientService>(TwitchClientService);
    http = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
    expect(service.getAccessToken).toBeDefined();

    const twitchClientAccessToken = await service.getAccessToken();

    expect(twitchClientAccessToken).toBeDefined();
    expect(twitchClientAccessToken).toBe(ACCESS_TOKEN);
    expect(request).toHaveBeenCalledWith('https://id.twitch.tv/oauth2/token?client_id=test&client_secret=test&grant_type=client_credentials');
  });

  it('should find username', async ()=> {
    const response: AxiosResponse<{ data: Array<{ login: string }> }> = {
      status: HttpStatus.OK,
      statusText: HttpStatus.OK.toString(),
      config: {},
      headers: {},
      data: {
        data: [{
          login: 'test'
        }]
      }
    };

    jest.spyOn(service, 'getAccessToken').mockImplementation(() => Promise.resolve('access_token'));
    jest.spyOn(http, 'get').mockImplementation(() => of(response));
    const login = await service.findUsername('test');
    expect(login).toBe('test');

    expect(http.get).toHaveBeenCalledWith('https://api.twitch.tv/helix/users?id=test', {
      headers: {
        'Client-ID': 'test',
        Authorization: 'Bearer access_token'
      }
    });
  });

  it('should check user status', async ()=> {
    const response: AxiosResponse<{ data: Array<{ user_login: string; type: string }> }> = {
      status: HttpStatus.OK,
      statusText: HttpStatus.OK.toString(),
      config: {},
      headers: {},
      data: {
        data: [{
          user_login: 'test',
          type: 'live'
        }]
      }
    };

    jest.spyOn(service, 'getAccessToken').mockImplementation(() => Promise.resolve('access_token'));
    jest.spyOn(http, 'get').mockImplementation(() => of(response));

    expect(await service.checkUsersStatus(['test'])).toEqual(response);
    expect(http.get).toHaveBeenCalledWith('https://api.twitch.tv/helix/streams?user_login=test', {
      headers: {
        'Client-Id': 'test',
        Authorization: 'Bearer access_token'
      }
    });
  });
});
