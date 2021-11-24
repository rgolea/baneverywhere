import {
  StatusResponse,
  TwitchUserProfile,
  TwitchUserSettings,
} from '@baneverywhere/api-interfaces';
import { logError } from '@baneverywhere/error-handler';
import { Body, Controller, Get, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TwitchProfile } from '../core/strategies/twitch-profile';
import { SettingsService } from './settings.service';

@UseGuards(AuthGuard('jwt'))
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':id')
  @logError()
  async getSettings(
    @Param('id') fromId: string,
    @TwitchProfile() { twitchId: toId, login: toUsername }: TwitchUserProfile
  ): Promise<StatusResponse<TwitchUserSettings>> {
    const settings = await this.settingsService.findOneOrCreateSettings({
      fromId,
      toId,
      toUsername
    });
    return {
      statusCode: HttpStatus.OK,
      data: {
        fromId: settings.fromId,
        toId: settings.toId,
        settings: settings.settings
      },
    };
  }

  @Put(':id')
  @logError()
  async updateSettings(
    @Param('id') fromId: string,
    @TwitchProfile() { twitchId: toId, login: toUsername }: TwitchUserProfile,
    @Body() { settings }: TwitchUserSettings
  ): Promise<StatusResponse<TwitchUserSettings>>{
    const res =  await this.settingsService.createOrUpdateSettings({
      fromId,
      toId,
      settings,
      toUsername
    });
    return {
      statusCode: HttpStatus.OK,
      data: res,
    };
  }
}
