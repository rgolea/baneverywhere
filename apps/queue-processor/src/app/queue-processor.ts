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

  private async handleBanUnban(action: Action, job: Job<Omit<Actions, 'queueFor'> & { cursor?: string }>, cb: DoneCallback){
    const pattern = action === Action.BAN ? BotPatterns.BOT_BAN_USER : BotPatterns.BOT_UNBAN_USER;

    const { cursor, ...data } = job.data;
    const settings = await this.dbService.settings.findMany({
      where: {
        fromUsername: data.streamer,
      },
      cursor: {
        id: cursor,
      },
      take: 50,
      skip: 1,
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

    automatic.forEach((username) => {
      this.botHandlerClient.emit(pattern, {
        queueFor: username,
        ...data,
      } as Actions);
    });

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
  async handleBan(job: Job<Omit<Actions, 'queueFor'> & { cursor?: string }>, cb: DoneCallback) {
    this.handleBanUnban(Action.BAN, job, cb);
  }

  @Process(Action.UNBAN)
  async handleUnban(job: Job<Omit<Actions, 'queueFor'> & { cursor?: string }>, cb: DoneCallback) {
    this.handleBanUnban(Action.UNBAN, job, cb);
  }
}
