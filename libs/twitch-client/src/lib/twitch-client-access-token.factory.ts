import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { TwitchClientOptions } from "./twitch-client.options";


export async function twitchClientAccessTokenFactory (http: HttpService, { clientID, clientSecret }: TwitchClientOptions) {
  const { data } = await lastValueFrom(
    http.post<{ access_token: string }>(
      `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${
        clientSecret
      }&grant_type=client_credentials`
    )
  );
  return data.access_token;
}
