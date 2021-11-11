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
    [
      'ibai',
      'rubius',
      'juansguarnizo',
      'illojuan',
      'montanablack88',
      'sodapoppin',
      'rainbow6',
      'scump',
      'hasanabi',
      'loltyler1',
      'castro_1021',
      'arteezy',
      'jackmanifoldtv',
      'trainwreckstv',
      'roshtein',
      'esl_csgo',
      'nickmercs',
      'lirik',
      'philza',
      'kkatamina',
      'northernlion',
      'forsen',
      'quin69',
      'kyle',
      'buddha',
      'shivfps',
      'doublelift',
      'veibae',
      'redbyrd',
      'followgrubby',
      'alinity',
      'marinemammalrescue',
      'TheGrefg',
      'wankilstudio',
      'twitchsports',
      '!!tztimmy',
      'real_bazzi',
      'daltoosh',
      'jinnytty',
      'supertf',
      'imaqtpie',
      'folagorlives',
      'diegosaurs',
      'primeleague',
      'mithrain',
      'xchocobars',
      'becca',
      'uccstudio',
      'harry',
      'mrsoki',
      'zok3r',
      'rgolea'
    ].forEach((channel) => {
      this.botHandlerClient.emit('user.online', channel);
    });
    res.json({
      statusCode: HttpStatus.OK,
      data: profile,
    });
  }
}
