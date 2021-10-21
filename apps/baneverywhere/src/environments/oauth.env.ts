import { WebOption } from '@byteowls/capacitor-oauth2';

export const OAUTH_ENV: WebOption = {
  redirectUrl: `${window.location.origin}/auth`,
  scope: 'user_read user:read:follows',
  appId: 'b361z2jtreid3u1demvx2v6xrvwfqr',
  authorizationBaseUrl: 'https://id.twitch.tv/oauth2/authorize',
};
