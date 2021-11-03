import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BanEverywhereSettings,
  StatusResponse,
  TwitchUserSettings,
} from '@baneverywhere/api-interfaces';
import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoadSettingsForUser, SaveSettings, UnloadSettings } from './settings.actions';
import { Optional } from 'utility-types';
import { FollowsState, FollowsStateModel } from '../follows/follows.state';

export class SettingsStateModel
  implements Optional<TwitchUserSettings, 'toId'>
{
  fromId: string;
  settings: BanEverywhereSettings;
  loading: boolean;
}

@State<Optional<SettingsStateModel> & { loading: boolean }>({
  name: 'settings',
  defaults: {
    loading: true,
  },
})
@Injectable()
export class SettingsState {
  constructor(private readonly http: HttpClient) {}

  static profile() {
    return createSelector(
      [SettingsState, FollowsState],
      (settingsState: SettingsStateModel, followsState: FollowsStateModel) => {
        if (!settingsState.fromId) return null;
        return followsState.follows.find(
          (user) => user.twitchId === settingsState.fromId
        );
      }
    );
  }

  @Selector()
  static settings(state: SettingsStateModel): BanEverywhereSettings {
    return state.settings;
  }

  @Action(UnloadSettings)
  unloadSettings(ctx: StateContext<SettingsStateModel>) {
    ctx.setState(() => ({ loading: true } as SettingsStateModel));
  }

  @Action(SaveSettings)
  saveSettings(ctx: StateContext<SettingsStateModel>, action: SaveSettings) {
    const state = ctx.getState();
    return this.http
      .put<StatusResponse<TwitchUserSettings>>(
        `${environment.API_URL}/settings/${state.fromId}`,
        { settings: action.payload.settings }
      )
      .pipe(
        map(({ data }) => data),
        map((data) => {
          ctx.setState((state) => ({
            ...state,
            settings: data.settings,
          }));
        })
      );
  }

  @Action(LoadSettingsForUser)
  loadSettingsForUser(
    ctx: StateContext<SettingsStateModel>,
    action: LoadSettingsForUser
  ) {
    ctx.setState((state) => ({
      ...state,
      fromId: action.payload.twitchId,
    }));
    return this.http
      .get<StatusResponse<TwitchUserSettings>>(
        `${environment.API_URL}/settings/${action.payload.twitchId}`
      )
      .pipe(
        map(({ data }) => data),
        map((data) => {
          ctx.setState((state) => ({
            ...state,
            settings: data.settings,
            loading: false,
          }));
        })
      );
  }
}
