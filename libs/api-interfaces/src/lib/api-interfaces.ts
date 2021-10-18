export interface TwitchUserProfile {
  login: string,
  profile_image_url: string;
}

export interface TwitchUserProfileAccess {
  user: TwitchUserProfile,
  accessToken: string
}

export interface StatusResponse<T = undefined> {
  statusCode: number,
  data?: T
}
