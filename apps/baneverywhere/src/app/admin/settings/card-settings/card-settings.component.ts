import { Component, OnInit, ViewChild } from '@angular/core';
import { TwitchUserProfile } from '@baneverywhere/api-interfaces';
import { BanEverywhereSettings } from "@prisma/client";
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import {
  LoadFollows,
  LoadMoreFollows,
} from '../../../store/follows/follows.actions';
import { FollowsState } from '../../../store/follows/follows.state';
import { SwalComponent, SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { LoadSettingsForUser, SaveSettings, UnloadSettings } from '../../../store/settings/settings.actions';
import { SettingsState } from '../../../store/settings/settings.state';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'baneverywhere-card-settings',
  templateUrl: './card-settings.component.html',
})
export class CardSettingsComponent implements OnInit {

  public selectedSettings = new FormControl();
  @ViewChild('followSettings') followSettings: SwalComponent;

  @Select(FollowsState.total) total$: Observable<number>;
  @Select(FollowsState.follows) follows$: Observable<TwitchUserProfile[]>;
  @Select(SettingsState.profile()) profile$: Observable<TwitchUserProfile>;
  @Select(SettingsState.settings) settings$: Observable<BanEverywhereSettings>;

  public settingsOptions = BanEverywhereSettings;
  private subscriptions: Subscription[] = [];

  constructor(private readonly store: Store, public readonly swalTargets: SwalPortalTargets) {}

  ngOnInit() {
    this.store.dispatch(new LoadFollows());
    this.subscriptions.push(
      this.settings$.subscribe(settings => {
        this.selectedSettings.setValue(settings);
      })
    );
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

  loadSettingsForUser(twitchId: string) {
    this.store.dispatch(new LoadSettingsForUser({ twitchId }));
    this.followSettings.fire();
  }

  resetSettingsStore(){
    this.store.dispatch(new UnloadSettings())
  }

  saveSettings(settings: FormControl) {
    this.store.dispatch(new SaveSettings({ settings: settings.value }));
  }
}
