import { State } from "@ngxs/store";
import { TwitchUserProfile } from "@baneverywhere/api-interfaces";

@State<{ access_token?: string, user?: TwitchUserProfile, bearer?: string }>({
  name: 'auth',
  defaults: null
})
export class AuthState {}
