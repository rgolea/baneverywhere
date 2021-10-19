import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  StatusResponse, TwitchUserProfile,
} from '@baneverywhere/api-interfaces';
import { TwitchProfile } from '../strategies/twitch-profile';

@Controller('auth')
export class AuthController {
  @Get('/twitch')
  @UseGuards(AuthGuard('twitch'))
  twitchProfile(@TwitchProfile() user: TwitchUserProfile): StatusResponse<TwitchUserProfile> {
    return {
      statusCode: HttpStatus.OK,
      data: user
    };
  }
}
