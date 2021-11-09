import { BotClientOptions, OptionsProviderFactory } from './bot-client.options';
import { BAN_BOT_OPTIONS } from './bot-client.tokens';

export function generateOptionsProvider(
  opts: OptionsProviderFactory | BotClientOptions
) {
  if ((opts as OptionsProviderFactory).useFactory) {
    return {
      provide: BAN_BOT_OPTIONS,
      inject: (opts as OptionsProviderFactory).inject,
      useFactory: (opts as OptionsProviderFactory).useFactory,
    };
  } else {
    return {
      provide: BAN_BOT_OPTIONS,
      useValue: opts as BotClientOptions,
    };
  }
}
