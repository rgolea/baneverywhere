import { Module, Global, DynamicModule, Provider, Scope } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { TWITCH_CLIENT_ACCESS_TOKEN, TWITCH_CLIENT_OPTS } from './twitch-client.token';
import { TwitchClientService } from './twitch-client.service';
import {  twitchClientAccessTokenFactory } from './twitch-client-access-token.factory';
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
      optionsProvider,
      {
        provide: TWITCH_CLIENT_ACCESS_TOKEN,
        useFactory: twitchClientAccessTokenFactory,
        inject: [HttpService, TWITCH_CLIENT_OPTS],
        scope: Scope.REQUEST
      } as Provider,
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
