import { TwitchUserSettings } from '@baneverywhere/api-interfaces';
import { BotDatabaseService } from '@baneverywhere/db';
import { Injectable } from '@nestjs/common';
import { Omit } from 'utility-types';
import { Settings, BanEverywhereSettings } from '@prisma/client';
import { TwitchClientService } from "@baneverywhere/twitch-client";
import { logError } from "@baneverywhere/error-handler";

@Injectable()
export class SettingsService {
  constructor(
    private readonly dbService: BotDatabaseService,
    private readonly twitchClientService: TwitchClientService,
  ) {}

  @logError()
  async findOneOrCreateSettings({
    fromId,
    toId,
    toUsername,
  }: Omit<TwitchUserSettings, 'settings'> & {
    toUsername: string;
  }): Promise<Settings> {
    let settings = await this.dbService.settings.findUnique({
      where: {
        fromId_toId: {
          fromId,
          toId,
        },
      },
    });
    if (settings) return settings;
    const fromUsername = await this.twitchClientService.findUsername(fromId);
    settings = await this.dbService.settings.create({
      data: {
        fromId,
        fromUsername,
        toUsername,
        toId,
        settings: BanEverywhereSettings.NONE,
      },
    });
    return settings;
  }

  @logError()
  async createOrUpdateSettings(config: TwitchUserSettings & { toUsername: string }): Promise<Settings> {
    const fromUsername = await this.twitchClientService.findUsername(config.fromId);
    return await this.dbService.settings.upsert({
      where: {
        fromId_toId: {
          fromId: config.fromId,
          toId: config.toId,
        },
      },
      create: {
        ...config,
        fromUsername,
        settings: BanEverywhereSettings.NONE,
      },
      update: {
        settings: config.settings
      },
    });
  }


}
