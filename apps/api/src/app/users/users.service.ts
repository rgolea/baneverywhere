import { Global, Injectable } from '@nestjs/common';
import { TwitchUserProfile } from "@baneverywhere/api-interfaces";
import { BotDatabaseService } from "@baneverywhere/db";
import { User } from "@prisma/client";
import { logError } from "@baneverywhere/error-handler";

@Global()
@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: BotDatabaseService
  ){}

  @logError()
  async createOrUpdateUser(profile: TwitchUserProfile): Promise<User> {
    return await this.dbService.user.upsert({
      where: {
        twitchId: profile.twitchId
      },
      create: profile,
      update: profile
    });
  }

  @logError()
  async findOneByTwitchId(twitchId: string): Promise<User> {
    return await this.dbService.user.findFirst({
      where: {
        twitchId
      }
    });
  }
}
