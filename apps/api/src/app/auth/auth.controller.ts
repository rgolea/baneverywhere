import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  StatusResponse,
  TwitchUserProfileAccess,
} from '@baneverywhere/api-interfaces';

@Controller('auth')
export class AuthController {
  @Get('/twitch')
  @UseGuards(AuthGuard('twitch'))
  async twitchLogin(): Promise<StatusResponse
  > {
    return {
      statusCode: HttpStatus.OK
    }
  }

  @Get('/twitch/callback')
  @UseGuards(AuthGuard('twitch'))
  async twitchLoginRedirect(
    @Req() req: Request
  ): Promise<StatusResponse<TwitchUserProfileAccess>> {
    return {
      statusCode: HttpStatus.OK,
      data: req['user'] as TwitchUserProfileAccess,
    };
  }
}
