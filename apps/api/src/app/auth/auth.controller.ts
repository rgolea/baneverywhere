import {
  Controller,
  Get,
  Res,
  HttpStatus,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TwitchUserProfile } from '@baneverywhere/api-interfaces';
import { TwitchProfile } from '../core/strategies/twitch-profile';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BOT_HANDLER_CONNECTION } from '@baneverywhere/namespaces';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(BOT_HANDLER_CONNECTION) private botHandlerClient: ClientProxy
  ) {}

  @Get('/twitch')
  @UseGuards(AuthGuard('twitch'))
  async twitchProfile(
    @TwitchProfile() profile: TwitchUserProfile,
    @Res() res
  ): Promise<void> {
    const { _id, twitchId } = (
      await this.usersService.createOrUpdateUser(profile)
    ).toJSON();
    const token = this.jwtService.sign({ _id, twitchId });
    res.setHeader('X-Access-Token', token);
    res.setHeader('Access-Control-Expose-Headers', 'X-Access-Token');
    this.botHandlerClient.emit('user.online', profile.login);
    res.json({
      statusCode: HttpStatus.OK,
      data: profile,
    });
  }
}
