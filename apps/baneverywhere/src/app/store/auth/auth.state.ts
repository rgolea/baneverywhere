import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AddAccessToken, AddJwtBearer, Logout } from './auth.actions';
import { AuthStateModule } from './auth-state.module';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, of, switchMap } from 'rxjs';
import {
  TwitchUserProfile,
  StatusResponse,
} from '@baneverywhere/api-interfaces';

export class AuthStateModel {
  access_token?: string;
  jwtBearer?: string;
  profile?: TwitchUserProfile;
}

@State<AuthStateModel>({
  name: 'auth',
})
@Injectable()
export class AuthState implements NgxsOnInit {
  constructor(private readonly http: HttpClient) {}

  ngxsOnInit(ctx: StateContext<AuthStateModel>){
    console.log('on init');
    const access_token = localStorage.getItem('access_token');
    ctx.dispatch(new AddAccessToken(access_token));
  }

  @Action(AddAccessToken)
  addAccessToken(
    ctx: StateContext<AuthStateModule>,
    { access_token }: AddAccessToken
  ) {
    localStorage.setItem('access_token', access_token);
    return of(
      ctx.setState((state) => ({
        ...state,
        access_token,
      }))
    ).pipe(
      switchMap(() =>
        this.http.get<StatusResponse<TwitchUserProfile>>(
          `${environment.API_URL}/auth/twitch`,
          {
            params: {
              access_token,
            },
          }
        )
      ),
      map(({ data: profile }) => {
        ctx.patchState({
          profile,
        });
      })
    );
  }

  @Action(AddJwtBearer)
  addJwtBearer(ctx: StateContext<AuthStateModule>, action: AddJwtBearer) {
    ctx.setState((state) => ({
      ...state,
      jwtBearer: action.jwtBearer,
    }));
  }

  @Action(Logout)
  logout(ctx:StateContext<AuthStateModule>){
    ctx.setState(null);
    localStorage.removeItem('access_token');
  }
}
