import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import * as TwitchTokenStrategy from "passport-twitch-token";
import { TwitchUserProfile } from "@baneverywhere/api-interfaces";
import { logError } from "@baneverywhere/error-handler";

@Injectable()
export class TwitchStrategy extends PassportStrategy(
  TwitchTokenStrategy,
  "twitch"
) {
  constructor(
    readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>('TWITCH_CLIENT_ID'),
      clientSecret: configService.get<string>('TWITCH_CLIENT_SECRET'),
      authorizationURL: "https://id.twitch.tv/oauth2/authorize",
      tokenURL: "https://id.twitch.tv/oauth2/token",
      profileURL: "https://api.twitch.tv/helix/users"
    });
  }

  @logError()
  async validate(_: unknown, __: unknown, data: { _raw: string } = { _raw: '{}'}): Promise<TwitchUserProfile> {
    const parsed = JSON.parse(data._raw);
    const { id: twitchId, login, profile_image_url, display_name } = parsed?.data?.[0] || {};
    return {
      twitchId,
      login,
      profile_image_url,
      display_name
    } as TwitchUserProfile;
  }
}
