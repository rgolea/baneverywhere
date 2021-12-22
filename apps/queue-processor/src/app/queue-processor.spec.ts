import { Test, TestingModule } from '@nestjs/testing';
import { QueueProcessor } from './queue-processor';
import { BotDatabaseService } from '@baneverywhere/db';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { mock } from 'jest-mock-extended';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { BOT_CONNECTION } from '@baneverywhere/namespaces';
import {
  Actions,
  Settings,
  User,
  Prisma,
  Action,
  BanEverywhereSettings,
} from '@prisma/client';
import { internet, name, lorem, random } from 'faker';
import { v4 as uuidv4 } from 'uuid';
import { of } from 'rxjs';
import { TwitchClientModule, TwitchClientService } from '@baneverywhere/twitch-client';

const machineUUID = uuidv4();
const users: User[] = new Array(4).fill(0).map(
  () =>
    ({
      login: internet.userName(),
      display_name: name.firstName(),
      profile_image_url: internet.avatar(),
      twitchId: uuidv4(),
      machineUUID,
    } as User)
);

const user = users[0];

const actions: Actions[] = new Array(5).fill(0).map(() => {
  const action = random.arrayElement([Action.BAN, Action.UNBAN]);
  return {
    action,
    user: `@${internet.userName()}`,
    moderator: `@${internet.userName()}`,
    streamer: `@${internet.userName()}`,
    inQueue: true,
    approved: true,
    processed: false,
    queueFor: user.login,
    ...(action === Action.BAN ? { reason: lorem.sentence() } : {}),
  } as Actions;
});

const settings = users
  .filter((_, i) => i > 0)
  .map(
    (u, i) =>
      ({
        fromId: user.twitchId,
        fromUsername: user.login,
        toId: u.twitchId,
        toUsername: u.login,
        settings: [
          BanEverywhereSettings.AUTOMATIC,
          BanEverywhereSettings.NONE,
          BanEverywhereSettings.WITH_VALIDATION,
        ][i - 1],
      } as Settings)
  );

describe('QueueProcessor', () => {
  let queueProcessor: QueueProcessor;
  let dbService: BotDatabaseService;
  let botHandlerClient: ClientProxy;

  const queue = mock<Queue>();

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
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
        })
      ],
      providers: [QueueProcessor, BotDatabaseService, TwitchClientService],
    })
      .overrideProvider(TwitchClientService)
      .useValue(mock<TwitchClientService>())
      .overrideProvider(getQueueToken('queue'))
      .useValue(queue)
      .compile();

    queueProcessor = app.get<QueueProcessor>(QueueProcessor);
    dbService = app.get<BotDatabaseService>(BotDatabaseService);
    botHandlerClient = app.get(BOT_CONNECTION);
    await dbService.machine.create({
      data: {
        uuid: machineUUID,
      },
    });

    await dbService.user.createMany({
      data: users,
    });

    await dbService.actions.createMany({
      data: actions,
    });

    await dbService.settings.createMany({
      data: settings,
    });
  });

  afterAll(async () => {
    jest.resetAllMocks();
    await dbService.user.deleteMany({});
    await dbService.machine.deleteMany({});
    await dbService.actions.deleteMany({});
    await dbService.settings.deleteMany({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(queueProcessor).toBeDefined();
  });

  it('should handle queue', async () => {
    const foundUser = await dbService.user.findUnique({
      where: {
        login: user.login,
      },
    });
    const job = mock<Job<{ username: string; cursor?: number }>>({
      data: { username: foundUser.login, cursor: null },
    });

    jest
      .spyOn(dbService.user, 'findUnique')
      .mockImplementationOnce(
        () => Promise.resolve(user) as Prisma.Prisma__UserClient<User>
      );

    const botHandlerClientEmitMock = jest
      .spyOn(botHandlerClient, 'emit')
      .mockImplementationOnce(() => of(null));

    jest.spyOn(dbService.actions, 'findMany');

    await queueProcessor.handleQueue(job);

    expect(dbService.user.findUnique).toHaveBeenCalledWith({
      where: {
        login: user.login,
      },
    });

    expect(dbService.actions.findMany).toHaveBeenCalledWith({
      where: {
        queueFor: user.login,
        inQueue: true,
        processed: false,
      },
      take: 50,
      skip: 0,
    });

    const processedActions = await dbService.actions.findMany({
      where: {
        processed: true,
      },
    });

    expect(processedActions.length).toBe(5);
    expect(botHandlerClientEmitMock).toHaveBeenCalledTimes(5);
  });

  it('should handle ban', () => {
    const job = mock<Job<Omit<Actions, 'queueFor'> & { cursor?: number }>>({
      data: {
        cursor: null,
      },
    });

    expect(queueProcessor.handleBanUnban).toBeDefined();
    jest
      .spyOn(queueProcessor, 'handleBanUnban')
      .mockImplementationOnce(() => Promise.resolve());
    expect(queueProcessor.handleBan).toBeDefined();
    queueProcessor.handleBan(job);
    expect(queueProcessor.handleBanUnban).toHaveBeenCalledWith(Action.BAN, job);
  });

  it('should handle unban', () => {
    const job = mock<Job<Omit<Actions, 'queueFor'> & { cursor?: number }>>({
      data: {
        cursor: null,
      },
    });

    expect(queueProcessor.handleBanUnban).toBeDefined();
    jest
      .spyOn(queueProcessor, 'handleBanUnban')
      .mockImplementationOnce(() => Promise.resolve());
    expect(queueProcessor.handleUnban).toBeDefined();
    queueProcessor.handleBan(job);
    expect(queueProcessor.handleBanUnban).toHaveBeenCalledWith(Action.BAN, job);
  });

  it('should handle automatic bans and unbans operations', async () => {
    const job = mock<Job<Omit<Actions, 'queueFor'> & { cursor?: number }>>({
      data: {
        action: Action.BAN,
        streamer: `#${user.login}`,
        moderator: `@${internet.userName()}`,
        user: `@${internet.userName()}`,
        reason: lorem.sentence(),
        cursor: null,
      },
    });

    jest.spyOn(dbService.settings, 'findMany');
    jest.spyOn(dbService.user, 'findMany');
    jest.spyOn(dbService.actions, 'create');
    jest.spyOn(botHandlerClient, 'emit');

    await queueProcessor.handleBanUnban(Action.BAN, job);

    expect(dbService.settings.findMany).toHaveBeenCalledWith({
      where: {
        fromUsername: user.login,
      },
      take: 50,
      skip: 0,
    });

    expect(dbService.user.findMany).toHaveBeenCalledWith({
      where: {
        login: {
          in: users.filter((_, i) => i > 0).map((u) => u.login),
        },
      },
      select: {
        login: true,
        machineUUID: true,
      },
    });

    expect(dbService.actions.create).toHaveBeenCalledTimes(3);
    expect(botHandlerClient.emit).toHaveBeenCalledTimes(1);
  });
});
