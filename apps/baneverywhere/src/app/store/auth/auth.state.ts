import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AddAccessToken, AddJwtBearer, Logout } from './auth.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { finalize, map, of, switchMap } from 'rxjs';
import {
  TwitchUserProfile,
  StatusResponse,
} from '@baneverywhere/api-interfaces';
import { JwtHelperService } from '@auth0/angular-jwt';

const jwtHelperService = new JwtHelperService();

export class AuthStateModel {
  isLoaded: boolean;
  access_token?: string;
  jwtBearer?: string;
  profile?: TwitchUserProfile;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    isLoaded: false,
  },
})
@Injectable()
export class AuthState implements NgxsOnInit {
  constructor(private readonly http: HttpClient) {}

  @Selector([AuthState.profile])
  static twitchId(_: AuthStateModel, profile: TwitchUserProfile){
    return profile.twitchId;
  }

  @Selector()
  static accessToken(state: AuthStateModel): string{
    return state.access_token;
  }

  @Selector()
  static jwtToken(state: AuthStateModel): string {
    return state.jwtBearer;
  }

  @Selector()
  static profile(state: AuthStateModel): TwitchUserProfile {
    return state.profile;
  }

  @Selector()
  static isLoaded(state: AuthStateModel): boolean {
    return state.isLoaded;
  }

  @Selector([AuthState.profile, AuthState.isAuthenticated])
  static profilePicture(_: AuthStateModel, profile: TwitchUserProfile): string {
    return profile?.profile_image_url;
  }

  @Selector([AuthState.isLoaded])
  static isAuthenticated(state: AuthStateModel, isLoaded: boolean): boolean {
    return Boolean(
      isLoaded && state.jwtBearer && !jwtHelperService.isTokenExpired(state.jwtBearer)
    );
  }

  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    const access_token = localStorage.getItem('access_token');
    ctx.dispatch(new AddAccessToken(access_token));
  }

  @Action(AddAccessToken)
  addAccessToken(
    ctx: StateContext<AuthStateModel>,
    { access_token }: AddAccessToken
  ) {
    if (access_token) localStorage.setItem('access_token', access_token);
    return of(
      ctx.setState((state) => ({
        ...state,
        access_token,
      }))
    ).pipe(
      switchMap(() => {
        if (!access_token) return of(null);
        return this.http
          .get<StatusResponse<TwitchUserProfile>>(
            `${environment.API_URL}/auth/twitch`,
            {
              params: {
                access_token,
              },
            }
          )
          .pipe(map(({ data: profile }) => profile));
      }),
      map((profile) => {
        ctx.patchState({
          profile,
        });
      }),
      finalize(() => ctx.patchState({ isLoaded: true }))
    );
  }

  @Action(AddJwtBearer)
  addJwtBearer(ctx: StateContext<AuthStateModel>, action: AddJwtBearer) {
    ctx.setState((state) => ({
      ...state,
      jwtBearer: action.jwtBearer,
    }));
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.setState(null);
    localStorage.removeItem('access_token');
  }
}
