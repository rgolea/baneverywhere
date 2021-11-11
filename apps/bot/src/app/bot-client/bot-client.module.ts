import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { BAN_BOT, BAN_BOT_OPTIONS } from './bot-client.tokens';
import { BotClientService } from './bot-client.service';
import { botClientFactory } from './bot-client.factory';
import { BotClientOptions, OptionsProviderFactory } from './bot-client.options';
import { generateOptionsProvider } from './bot-client-module.generators';

export function generateModule(
  optionsProvider: Provider<BotClientOptions>,
  imports = []
) {
  return {
    module: BotClientModule,
    imports: [...imports],
    exports: [BotClientService],
    providers: [
      optionsProvider,
      {
        provide: BAN_BOT,
        useFactory: botClientFactory,
        inject: [BAN_BOT_OPTIONS],
      },
    ],
  };
}

@Global()
@Module({
  providers: [BotClientService],
})
export class BotClientModule {
  static forRoot(opts: BotClientOptions): DynamicModule {
    const optionsProvider = generateOptionsProvider(opts);
    return generateModule(optionsProvider);
  }

  static forRootAsync(opts: OptionsProviderFactory): DynamicModule {
    const optionsProvider = generateOptionsProvider(opts);
    return generateModule(optionsProvider, opts.imports);
  }
}
