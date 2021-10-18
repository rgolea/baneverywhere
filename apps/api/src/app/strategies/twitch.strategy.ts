import { TwitchUserProfileAccess } from "@baneverywhere/api-interfaces";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, StrategyOptions, TwitchProfile } from 'passport-twitch-latest';

@Injectable()
export class TwitchStrategy extends PassportStrategy(Strategy, 'twitch') {
  constructor(
    readonly configService: ConfigService
  ){
    super({
      clientID: configService.get<string>('TWITCH_CLIENT_ID'),
      clientSecret: configService.get<string>('TWITCH_CLIENT_SECRET'),
      scope: 'user_read',
      authorizationURL: `${configService.get<string>('DOMAIN') || 'http://localhost:3333'}/auth/twitch`,
      callbackURL: `${configService.get<string>('DOMAIN') || 'http://localhost:3333'}/auth/twitch/callback`
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    _: string,
    profile: TwitchProfile
  ): Promise<TwitchUserProfileAccess> {
    const { login, profile_image_url } = profile;
    const user = {
      login,
      profile_image_url
    };

    const payload = {
      user,
      accessToken,
    };

    return payload;
  }
}
