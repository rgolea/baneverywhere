export interface TwitchUserProfile {
  twitchId: string;
  login: string;
  profile_image_url: string;
  display_name: string;
}
export interface StatusResponse<T = undefined> {
  statusCode: number;
  data?: T;
}
export interface TwitchFollower {
  from_id:     string;
  from_login:  string;
  from_name:   string;
  to_id:       string;
  to_login:    string;
  to_name:     string;
  followed_at: string;
}

export interface TwitchListResponse<T> {
  pagination: {
    cursor: string
  };
  total: number;
  data: Array<T>;
}

export enum BanEverywhereSettings {
  AUTOMATIC = 'automatic',
  WITH_VALIDATION = 'with_validation',
  NONE = 'none'
}

export interface TwitchUserSettings {
  fromId: string;
  toId: string;
  settings: BanEverywhereSettings;
}
