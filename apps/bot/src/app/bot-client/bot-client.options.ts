import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export interface BotClientOptions {
  debug?: boolean;
  username: string;
  clientId: string;
  clientSecret: string;
  twitchOAuthURL?: string;
}

export interface OptionsProviderFactory {
  useFactory: FactoryProvider<BotClientOptions>['useFactory'];
  inject: FactoryProvider['inject'];
  imports?: ModuleMetadata['imports'];
}
