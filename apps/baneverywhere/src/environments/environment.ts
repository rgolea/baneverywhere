// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { WebOption } from '@byteowls/capacitor-oauth2';

export const environment = {
  production: false,
  oauth: {
    redirectUrl: 'http://localhost:4200/auth',
    scope: 'user_read',
    appId: 'b361z2jtreid3u1demvx2v6xrvwfqr',
    authorizationBaseUrl: 'https://id.twitch.tv/oauth2/authorize',
  } as WebOption
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
