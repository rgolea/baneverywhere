export interface TwitchUserProfile {
  twitchId: string,
  login: string,
  profile_image_url: string;
  display_name: string;
}
export interface StatusResponse<T = undefined> {
  statusCode: number,
  data?: T
}
