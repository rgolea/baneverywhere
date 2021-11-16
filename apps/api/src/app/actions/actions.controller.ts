import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Actions } from '@prisma/client';
import { ActionsService } from './actions.service';
import { Prisma, Action } from '@prisma/client';
import { TwitchProfile } from '../core/strategies/twitch-profile';
import { TwitchUserProfile } from '@baneverywhere/api-interfaces';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get()
  findAll(
    @TwitchProfile() { login: toUsername }: TwitchUserProfile,
    @Query('type') action?: Action,
    @Query('where') where: Prisma.ActionsWhereInput = {},
    @Query('cursor') cursor?: Prisma.ActionsWhereUniqueInput,
    @Query('take') take = 50
  ): Promise<Actions[]> {
    return this.actionsService.findAll({
      where: {
        ...where,
        ...action ? { action } : {},
        queueFor: toUsername,
      },
      take,
      ...(cursor ? { cursor } : {}),
      skip: cursor ? 1 : 0,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
