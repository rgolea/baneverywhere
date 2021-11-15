import { interval, mapTo, Observable, skip, take } from 'rxjs';

/**
 * @description Bot messages sent to the bot
 */
export enum BotPatterns {
  BOT_GET_STATUS = 'bot:get:status', // Request the status of the bots
  BOT_STATUS_RESPONSE = 'bot:status:response', // Response from bot with the status
  BOT_CONNECT_CHANNEL = 'bot:connect:channel', // Make bot connect to a twitch channel
  BOT_BAN_USER = 'bot:ban:user',
  BOT_UNBAN_USER = 'bot:unban:user',
  USER_ONLINE = 'user:online',
  USER_OFFLINE = 'user:offline',
}

export interface BotStatus {
  count: number;
  users: string[];
}

export interface BotGetStatusResponse {
  identifier: string; // Bot identifier
  status: BotStatus;
}

export interface BotConnectChannelParams {
  channelName: string;
  botId: string;
}

export interface BotConnectChannelResponse {
  status: BotStatus;
}

export interface BotDisconnectChannelParams {
  channelName: string;
}

export type Never = Observable<undefined>;

export const respondLater: () => Never = () => interval(10000).pipe(
  skip(1),
  take(1),
  mapTo(undefined)
);
