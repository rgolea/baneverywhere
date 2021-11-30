import { Module, Global, DynamicModule, Provider } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TwitchClientService } from './twitch-client.service';
import { TwitchClientOptions, TwitchClientOptionsProviderFactory } from './twitch-client.options';
import { generateOptionsProvider } from './twitch-client-module.generators';
import { logError } from "@baneverywhere/error-handler";


function generateModule(
  optionsProvider: Provider<TwitchClientOptions>,
  imports = []
){
  return {
    module: TwitchClientModule,
    imports: [...imports],
    exports: [TwitchClientService],
    providers: [
      optionsProvider
    ]
  };
}

@Global()
@Module({
  imports: [HttpModule],
  providers: [TwitchClientService]
})
export class TwitchClientModule {
  @logError()
  static forRoot(opts: TwitchClientOptions): DynamicModule {
    const optionsProvider = generateOptionsProvider(opts);
    return generateModule(optionsProvider);
  }

  @logError()
  static forRootAsync(opts: TwitchClientOptionsProviderFactory){
    const optionsProvider = generateOptionsProvider(opts);
    return generateModule(optionsProvider, opts.imports);
  }
}
