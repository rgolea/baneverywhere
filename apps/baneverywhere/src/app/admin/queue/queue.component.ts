import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoadQueueForUser, UnloadQueue } from '../../store/queue/queue-actions';
import { Action } from '@prisma/client';

@Component({
  selector: 'baneverywhere-queue',
  templateUrl: './queue.component.html',
})
export class QueueComponent implements OnInit {
  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store.dispatch(new UnloadQueue());
    this.store.dispatch(
      new LoadQueueForUser({
        type: Action.BAN,
      })
    );
  }
}
