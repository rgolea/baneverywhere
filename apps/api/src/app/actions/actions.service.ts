import { BotDatabaseService } from '@baneverywhere/db';
import { logError } from '@baneverywhere/error-handler';
import { Injectable } from '@nestjs/common';
import { Actions, Prisma } from '@prisma/client';

@Injectable()
export class ActionsService {
  constructor(private readonly dbService: BotDatabaseService) {}

  @logError()
  findAll(args: Prisma.ActionsFindManyArgs): Promise<Actions[]> {
    return this.dbService.actions.findMany(args);
  }

  @logError()
  update(id: number, approved: boolean) {
    return this.dbService.actions.update({
      where: { id },
      data: {
        inQueue: true,
        approved
      },
    })
  }
}
