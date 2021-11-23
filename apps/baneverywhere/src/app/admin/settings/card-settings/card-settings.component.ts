import { Component, OnInit, ViewChild } from '@angular/core';
import { TwitchUserProfile } from '@baneverywhere/api-interfaces';
import { BanEverywhereSettings } from "@prisma/client";
import { Select, Store } from '@ngxs/store';
import { lastValueFrom, Observable } from 'rxjs';
import {
  LoadFollows,
  LoadMoreFollows,
  UnloadFollows
} from '../../../store/follows/follows.actions';
import { FollowsState } from '../../../store/follows/follows.state';
import { SwalComponent, SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { LoadSettingsForUser, SaveSettings, UnloadSettings } from '../../../store/settings/settings.actions';
import { SettingsState } from '../../../store/settings/settings.state';

@Component({
  selector: 'baneverywhere-card-settings',
  templateUrl: './card-settings.component.html',
})
export class CardSettingsComponent implements OnInit {

  @ViewChild('followSettings') followSettings: SwalComponent;

  @Select(FollowsState.total) total$: Observable<number>;
  @Select(FollowsState.follows) follows$: Observable<TwitchUserProfile[]>;
  @Select(SettingsState.profile()) profile$: Observable<TwitchUserProfile>;
  @Select(SettingsState.settings) settings$: Observable<BanEverywhereSettings>;

  public settingsOptions = BanEverywhereSettings;

  constructor(private readonly store: Store, public readonly swalTargets: SwalPortalTargets) {}

  ngOnInit() {
    this.store.dispatch(new UnloadFollows());
    this.store.dispatch(new LoadFollows());
  }

  loadMore() {
    const cursor = this.store.selectSnapshot(FollowsState.cursor);
    if (!cursor?.length) return;
    this.store.dispatch(
      new LoadMoreFollows({
        after: cursor,
      })
    );
  }

  async loadSettingsForUser(twitchId: string) {
    await lastValueFrom(this.store.dispatch(new LoadSettingsForUser({ twitchId })));
    this.followSettings.fire();
  }

  resetSettingsStore(){
    this.store.dispatch(new UnloadSettings())
  }

  saveSettings(settings: BanEverywhereSettings) {
    this.store.dispatch(new SaveSettings({ settings }));
  }
}
