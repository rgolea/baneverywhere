import { BotDatabaseService } from '@baneverywhere/db';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Action, BanEverywhereSettings } from '@prisma/client';
import { DoneCallback, Job, Queue } from 'bull';
import { Actions } from '@prisma/client';
import { BOT_CONNECTION } from '@baneverywhere/namespaces';
import { ClientProxy } from '@nestjs/microservices';
import { BotPatterns } from '@baneverywhere/bot-interfaces';

@Processor('queue')
export class QueueProcessor {
  constructor(
    private readonly dbService: BotDatabaseService,
    @InjectQueue('queue') private readonly queue: Queue,
    @Inject(BOT_CONNECTION) private readonly botHandlerClient: ClientProxy
  ) {}

  private async handleBanUnban(
    action: Action,
    job: Job<Omit<Actions, 'queueFor'> & { cursor?: string }>,
    cb: DoneCallback
  ) {
    const pattern =
      action === Action.BAN
        ? BotPatterns.BOT_BAN_USER
        : BotPatterns.BOT_UNBAN_USER;

    const { cursor, ...data } = job.data;
    const settings = await this.dbService.settings.findMany({
      where: {
        fromUsername: data.streamer.substr(1),
      },
      take: 50,
      skip: cursor ? 1 : 0,
      ...(cursor ? { cursor: { id: cursor } } : null),
    });

    const { automatic, queue } = settings.reduce(
      (prev, curr) => {
        if (curr.settings === BanEverywhereSettings.AUTOMATIC) {
          prev.automatic.push(curr.toUsername);
        } else if (curr.settings === BanEverywhereSettings.WITH_VALIDATION) {
          prev.queue.push(curr.toUsername);
        }
        return prev;
      },
      { automatic: [], queue: [] }
    );

    await Promise.all(
      automatic.map(async (username) => {
        const channel = await this.dbService.channels.findUnique({
          where: {
            username,
          },
        });
        if (channel) {
          this.botHandlerClient.emit(pattern, {
            queueFor: username,
            ...data,
          } as Actions);
        } else {
          await this.dbService.actions.create({
            data: {
              queueFor: username,
              inQueue: true,
              ...data,
            },
          });
        }
      })
    );

    await Promise.all(
      queue.map((username) => {
        return this.dbService.actions.create({
          data: {
            queueFor: username,
            ...data,
          },
        });
      })
    );

    if (settings.length === 50) {
      this.queue.add(action, {
        ...job.data,
        cursor: settings[49].id,
      });
    }

    cb();
  }

  @Process(Action.BAN)
  async handleBan(
    job: Job<Omit<Actions, 'queueFor'> & { cursor?: string }>,
    cb: DoneCallback
  ) {
    this.handleBanUnban(Action.BAN, job, cb);
  }

  @Process(Action.UNBAN)
  async handleUnban(
    job: Job<Omit<Actions, 'queueFor'> & { cursor?: string }>,
    cb: DoneCallback
  ) {
    this.handleBanUnban(Action.UNBAN, job, cb);
  }

  @Process('queue')
  async handleQueue(
    job: Job<{ username: string; cursor: string }>,
    cb: DoneCallback
  ) {
    const { username, cursor } = job.data;
    console.log(username, cursor);
    if (!cursor) {
      await this.dbService.actions.deleteMany({
        where: {
          queueFor: username,
          inQueue: true,
          approved: false,
        },
      });
    }

    const actions = await this.dbService.actions.findMany({
      where: {
        queueFor: username,
        inQueue: true,
      },
      take: 50,
      skip: cursor ? 1 : 0,
      ...(cursor ? { cursor: { id: cursor } } : null),
    });

    if (actions.length === 50) {
      this.queue.add('queue', {
        ...job.data,
        cursor: actions[49].id,
      });
    }

    actions.map((action) => {
      const pattern =
        action.action === Action.BAN
          ? BotPatterns.BOT_BAN_USER
          : BotPatterns.BOT_UNBAN_USER;
      this.botHandlerClient.emit(pattern, action);
    });
    await this.dbService.actions.deleteMany({
      where: {
        id: {
          in: actions.map((action) => action.id),
        }
      }
    }).catch(err => console.log(err));

    cb();
  }
}
