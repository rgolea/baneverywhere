import { Injectable } from '@angular/core';
import { BanEverywhereSetting } from '@baneverywhere/api-interfaces';
import { Action, State, StateContext } from '@ngxs/store';
import { LoadSettingsForUser } from './settings.actions';

export class SettingsStateModel {
  twitchId: string;
  setting: BanEverywhereSetting;
}

@State<SettingsStateModel>({
  name: 'settings',
})
@Injectable()
export class SettingsState {
  @Action(LoadSettingsForUser)
  loadSettingsForUser(
    ctx: StateContext<SettingsStateModel>,
    action: LoadSettingsForUser
  ) {
    ctx.setState((state) => ({
      ...state,
      twitchId: action.payload.twitchId,
    }));
  }
}
