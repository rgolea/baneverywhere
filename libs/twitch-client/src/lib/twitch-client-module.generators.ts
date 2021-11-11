import { TwitchClientOptions,  TwitchClientOptionsProviderFactory} from "./twitch-client.options";
import { TWITCH_CLIENT_OPTS } from "./twitch-client.token";

export function generateOptionsProvider(
  opts: TwitchClientOptionsProviderFactory | TwitchClientOptions
) {
  if ((opts as TwitchClientOptionsProviderFactory).useFactory) {
    return {
      provide: TWITCH_CLIENT_OPTS,
      inject: (opts as TwitchClientOptionsProviderFactory).inject,
      useFactory: (opts as TwitchClientOptionsProviderFactory).useFactory,
    };
  } else {
    return {
      provide: TWITCH_CLIENT_OPTS,
      useValue: opts as TwitchClientOptions,
    };
  }
}
