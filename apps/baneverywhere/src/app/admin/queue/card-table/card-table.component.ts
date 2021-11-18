import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { mergeMap, Observable, Subscription, switchMap } from 'rxjs';
import { Queue, QueueState } from '../../../store/queue/queue.state';
import {
  LoadQueueForUser,
  SaveQueue,
  UnloadQueue,
} from '../../../store/queue/queue-actions';
import { Action } from '@prisma/client';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'baneverywhere-card-table',
  templateUrl: './card-table.component.html',
})
export class CardTableComponent implements OnInit, OnDestroy {
  @Select(QueueState.queue) queue$: Observable<Queue[]>;
  @Select(QueueState.isLoading) loading$: Observable<boolean>;
  public actionTypes = Action;
  public form = new FormControl(Action.BAN, [Validators.required]);
  private subscriptions: Subscription[] = [];

  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.subscriptions.push(
      this.form.valueChanges
        .pipe(
          mergeMap((action: Action) =>
            this.store
              .dispatch(new UnloadQueue())
              .pipe(
                switchMap(() =>
                  this.store.dispatch(new LoadQueueForUser({ type: action }))
                )
              )
          )
        )
        .subscribe()
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  processAction(approve: boolean, queue: Queue) {
    this.store.dispatch(
      new SaveQueue({
        queueId: queue.id,
        approved: approve,
      })
    );
  }
}
