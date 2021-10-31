import { Component, OnInit } from '@angular/core';
import { TwitchUserProfile } from '@baneverywhere/api-interfaces';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  LoadFollows,
  LoadMoreFollows,
} from '../../../store/follows/follows.actions';
import { FollowsState } from '../../../store/follows/follows.state';

@Component({
  selector: 'baneverywhere-card-settings',
  templateUrl: './card-settings.component.html',
})
export class CardSettingsComponent implements OnInit {
  @Select(FollowsState.total) total$: Observable<number>;
  @Select(FollowsState.follows) follows$: Observable<TwitchUserProfile[]>;

  constructor(private readonly store: Store) {}

  ngOnInit() {
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
}
