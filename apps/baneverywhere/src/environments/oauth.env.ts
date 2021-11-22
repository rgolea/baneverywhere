import { WebOption } from '@byteowls/capacitor-oauth2';

export const OAUTH_ENV: WebOption = {
  redirectUrl: `${window.location.origin}/auth`,
  scope: 'user_read user:read:follows',
  appId: 'w9y5kumto3xoyb3oomepaqz8si44pq',
  authorizationBaseUrl: 'https://id.twitch.tv/oauth2/authorize',
  responseType: 'access_token'
};
