import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { BotDatabaseService } from '@baneverywhere/db';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { BOT_CONNECTION } from '@baneverywhere/namespaces';
import {
  TwitchClientModule,
  TwitchClientService,
} from '@baneverywhere/twitch-client';
import { internet, name, random } from 'faker';
import { v4 as uuidv4 } from 'uuid';
import { AxiosResponse } from 'axios';
import { HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { of } from 'rxjs';
import { BotPatterns } from '@baneverywhere/bot-interfaces';
import { mock } from 'jest-mock-extended';
import { ConfigModule } from '@nestjs/config';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';

const machineUUID = uuidv4();

const users: User[] = new Array(10).fill(0).map(
  () =>
    ({
      login: internet.userName(),
      display_name: name.firstName(),
      profile_image_url: internet.avatar(),
      twitchId: uuidv4(),
    } as User)
);
describe('AppService', () => {
  const botClient = mock<ClientProxy>();
  let service: AppService;
  let dbService: BotDatabaseService;
  let twitchClientService: TwitchClientService;

  const queue = mock<Queue>();

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        BullModule.registerQueue({
          name: 'queue',
        }),
        ClientsModule.register([
          {
            name: BOT_CONNECTION,
            transport: Transport.TCP,
          },
        ]),
        TwitchClientModule.forRoot({
          clientID: 'test',
          clientSecret: 'test',
        }),
      ],
      providers: [AppService, BotDatabaseService, TwitchClientService],
    })
      .overrideProvider(TwitchClientService)
      .useValue(mock<TwitchClientService>())
      .overrideProvider(getQueueToken('queue'))
      .useValue(queue)
      .overrideProvider(BOT_CONNECTION)
      .useValue(botClient)
      .compile();

    service = testingModule.get<AppService>(AppService);
    dbService = testingModule.get<BotDatabaseService>(BotDatabaseService);
    twitchClientService =
      testingModule.get<TwitchClientService>(TwitchClientService);

    await dbService.machine.create({
      data: {
        uuid: machineUUID,
      },
    });

    await dbService.user.createMany({
      data: users,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await dbService.user.deleteMany({});
    await dbService.machine.deleteMany({});
  });

  describe('Dependency Injection', () => {
    it('should have all dependencies injected', () => {
      expect(service).toBeDefined();
      expect(service.twitchClientService).toBeTruthy();
      expect(service.botClient).toBeTruthy();
      expect(service.dbService).toBeTruthy();
    });
  });

  describe('onModuleInit', () => {
    it('should be defined', () => {
      expect(service.onModuleInit).toBeDefined();
    });
  });

  describe('Check if user is online', () => {
    it('`checkOnline` should be defined', () => {
      expect(service.checkOnline).toBeDefined();
    });

    it('`checkIfUserIsOnline` should be defined', () => {
      expect(service.checkIfUserIsOnline).toBeDefined();
    });

    it('should check user status', async () => {
      type OnlineOffline = {
        user_login: string;
        type: 'live' | 'offline';
      };
      const { online, offline } = users
        .map(
          (u) =>
            ({
              user_login: u.login,
              type: random.arrayElement(['live', 'offline']),
            } as OnlineOffline)
        )
        .reduce(
          (acc, curr) => {
            if (curr.type === 'live') {
              acc.online.push(curr);
            } else {
              acc.offline.push(curr);
            }
            return acc;
          },
          {
            online: [] as OnlineOffline[],
            offline: [] as OnlineOffline[],
          }
        );
      const response: AxiosResponse<{
        data: Array<{ user_login: string; type: string }>;
      }> = {
        status: HttpStatus.OK,
        data: {
          data: online,
        },
        config: {},
        statusText: HttpStatus.OK.toString(),
        headers: {},
      };
      await dbService.user.updateMany({
        where: {
          login: {
            in: offline.map((u) => u.user_login),
          },
        },
        data: {
          machineUUID,
        },
      });

      jest
        .spyOn(twitchClientService, 'checkUsersStatus')
        .mockImplementation(() => Promise.resolve(response));

      botClient.send.mockImplementation(() => of(null));

      await service.checkIfUserIsOnline();

      expect(twitchClientService.checkUsersStatus).toHaveBeenLastCalledWith(
        users.map((u) => u.login)
      );

      expect(queue.add).toHaveBeenCalledTimes(online.length);

      expect(botClient.send.mock.calls).toEqual(
        expect.arrayContaining([
          ...online.map((u) => [
            BotPatterns.USER_ONLINE,
            {
              botId: machineUUID,
              channelName: u.user_login,
            },
          ]),
        ])
      );

      expect(botClient.emit.mock.calls).toEqual(
        expect.arrayContaining([
          ...offline.map((u) => [
            BotPatterns.USER_OFFLINE,
            {
              botId: machineUUID,
              channelName: u.user_login,
            },
          ]),
        ])
      );
    });

    it('should preassign machine to user', async () => {
      await dbService.user.update({
        where: {
          login: users[0].login
        },
        data: {
          machineUUID: null,
        }
      });

      expect(service.preassignMachineToUser).toBeDefined();
      const machine = await service.preassignMachineToUser(users[0].login);
      expect(machine).toBeTruthy();
      expect(machine).toEqual(machineUUID);

    });
  });
});
