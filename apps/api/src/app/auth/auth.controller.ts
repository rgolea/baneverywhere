import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  StatusResponse, TwitchUserProfile,
} from '@baneverywhere/api-interfaces';
import { TwitchProfile } from '../strategies/twitch-profile';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService
  ){}

  @Get('/twitch')
  @UseGuards(AuthGuard('twitch'))
  async twitchProfile(@TwitchProfile() user: TwitchUserProfile): Promise<StatusResponse<TwitchUserProfile>> {
    await this.usersService.createOrUpdateUser(user);
    return {
      statusCode: HttpStatus.OK,
      data: user
    };
  }
}
