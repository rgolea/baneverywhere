import { FactoryProvider, ModuleMetadata } from "@nestjs/common";

export interface TwitchClientOptions {
  clientID: string;
  clientSecret: string
}

export interface TwitchClientOptionsProviderFactory {
  useFactory: FactoryProvider<TwitchClientOptions>['useFactory'];
  inject: FactoryProvider['inject'];
  imports?: ModuleMetadata['imports'];
}
