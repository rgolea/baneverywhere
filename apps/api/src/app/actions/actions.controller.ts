import { Body, Controller, Get, HttpStatus, Param, Put, Query, UseGuards } from '@nestjs/common';
import { Actions } from '@prisma/client';
import { ActionsService } from './actions.service';
import { Prisma, Action } from '@prisma/client';
import { TwitchProfile } from '../core/strategies/twitch-profile';
import { TwitchUserProfile, StatusResponse } from '@baneverywhere/api-interfaces';
import { AuthGuard } from '@nestjs/passport';
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { logError } from '@baneverywhere/error-handler';

@UseGuards(AuthGuard('jwt'))
@Controller('actions')
export class ActionsController {
  constructor(
    private readonly actionsService: ActionsService,
    @InjectQueue('queue') private readonly queue: Queue,
  ) {}

  @Get()
  @logError()
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
        inQueue: false,
        processed: false
      },
      take,
      ...(cursor ? { cursor } : {}),
      skip: cursor ? 1 : 0,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Put(':id')
  @logError()
  async update(
    @Param('id') id: number,
    @Body('approved') approved: boolean,
    @TwitchProfile() { login: channelName }: TwitchUserProfile,
  ): Promise<StatusResponse<boolean>>{
    await this.actionsService.update(id, approved);
    await this.queue.add('queue', { username: channelName });
    return {
      statusCode: HttpStatus.OK,
      data: true
    }
  }
}
