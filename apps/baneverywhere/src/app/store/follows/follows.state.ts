import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  TwitchFollower,
  TwitchListResponse,
  TwitchUserProfile,
} from '@baneverywhere/api-interfaces';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { map, switchMap, tap } from 'rxjs';
import { AuthState } from '../auth/auth.state';
import { LoadFollows, LoadMoreFollows } from './follows.actions';
import { Omit, Optional } from 'utility-types';

export class FollowsStateModel
  implements
    Optional<Omit<TwitchListResponse<TwitchFollower>, 'data'>, 'pagination'>
{
  follows: TwitchUserProfile[];
  total: number;
  pagination?: {
    cursor: string;
  };
}

@State<FollowsStateModel>({
  name: 'follows',
  defaults: {
    follows: [],
    total: 0
  },
})
@Injectable()
export class FollowsState {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store
  ) {}

  @Selector()
  static total(state: FollowsStateModel) {
    return state.total;
  }

  @Selector()
  static follows(state: FollowsStateModel) {
    return state.follows || [];
  }

  @Action(LoadFollows)
  loadFollows() {
    this.store.dispatch(new LoadMoreFollows());
    // this.http.get('https://api.twitch.tv/helix/users/follows', {

    // })
  }

  @Action(LoadMoreFollows)
  loadMoreFollows(
    ctx: StateContext<FollowsStateModel>,
    { payload }: LoadMoreFollows
  ) {
    const twitchId = this.store.selectSnapshot(AuthState.twitchId);
    return this.http
      .get<TwitchListResponse<TwitchFollower>>(
        'https://api.twitch.tv/helix/users/follows',
        {
          params: {
            ...payload,
            from_id: twitchId,
          },
        }
      )
      .pipe(
        tap((val) => {
          ctx.patchState({
            total: val.total,
            pagination: val.pagination,
          });
        }),
        switchMap((val) =>
          this.http.get<{ data: TwitchUserProfile[] }>(
            `https://api.twitch.tv/helix/users?id=${val.data
              .map((user) => user.to_id)
              .join('&id=')}`
          )
        ),
        map(({ data }) =>
          data.map(
            (user) =>
              ({
                display_name: user.display_name,
                login: user.login,
                twitchId: user['id'],
                profile_image_url: user.profile_image_url,
              } as TwitchUserProfile)
          )
        ),
        tap((val) =>
          ctx.setState((state) => ({
            ...state,
            follows: [...state.follows, ...val],
          }))
        )
      );
  }
}
