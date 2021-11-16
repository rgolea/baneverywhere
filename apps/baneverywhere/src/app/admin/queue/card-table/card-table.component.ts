import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Queue, QueueState } from '../../../store/queue/queue.state';

@Component({
  selector: 'baneverywhere-card-table',
  templateUrl: './card-table.component.html',
})
export class CardTableComponent {
  @Select(QueueState.queue) queue$: Observable<Queue[]>;
  @Select(QueueState.isLoading) loading$: Observable<boolean>;
}
