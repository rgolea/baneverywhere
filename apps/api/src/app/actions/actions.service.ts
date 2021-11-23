import { BotDatabaseService } from '@baneverywhere/db';
import { Injectable } from '@nestjs/common';
import { Actions, Prisma } from '@prisma/client';

@Injectable()
export class ActionsService {
  constructor(private readonly dbService: BotDatabaseService) {}

  findAll(args: Prisma.ActionsFindManyArgs): Promise<Actions[]> {
    return this.dbService.actions.findMany(args);
  }

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
