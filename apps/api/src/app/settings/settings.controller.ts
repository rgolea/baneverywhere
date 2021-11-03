import {
  StatusResponse,
  TwitchUserProfile,
  TwitchUserSettings,
} from '@baneverywhere/api-interfaces';
import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TwitchProfile } from '../core/strategies/twitch-profile';
import { SettingsService } from './settings.service';

@UseGuards(AuthGuard('jwt'))
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}
  @Get(':id')
  async getSettings(
    @Param('id') fromId: string,
    @TwitchProfile() { twitchId: toId }: TwitchUserProfile
  ): Promise<StatusResponse<TwitchUserSettings>> {
    const settings = await this.settingsService.createOrUpdateSettings({
      fromId,
      toId,
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
}
