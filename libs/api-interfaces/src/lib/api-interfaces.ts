export interface TwitchUserProfile {
  id: string,
  login: string,
  profile_image_url: string;
}
export interface StatusResponse<T = undefined> {
  statusCode: number,
  data?: T
}
