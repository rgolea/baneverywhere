import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Actions as QueueModel, Prisma } from '@prisma/client';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoadQueueForUser, UnloadQueue, SaveQueue } from './queue-actions';

export type Queue = Pick<
  QueueModel,
  'action' | 'id' | 'approved' | 'createdAt' | 'reason' | 'user'
>;

export class QueueStateModel {
  loading: boolean;
  queue: Queue[];
}

@State<QueueStateModel>({
  name: 'queue',
  defaults: {
    queue: [],
    loading: true,
  },
})
@Injectable()
export class QueueState {
  constructor(private readonly http: HttpClient) {}

  @Selector()
  static queue(state: QueueStateModel) {
    return state.queue;
  }

  @Selector()
  static isLoading(state: QueueStateModel) {
    return state.loading;
  }

  @Action(LoadQueueForUser)
  loadQueueForUser(
    ctx: StateContext<QueueStateModel>,
    action: LoadQueueForUser
  ) {
    const state = ctx.getState();
    ctx.setState({
      loading: true,
      queue: [...state.queue],
    });
    const cursor = state.queue[state.queue.length - 1]?.id;
    return this.http
      .get<QueueModel[]>(`${environment.API_URL}/actions`, {
        params: {
          type: action.payload.type,
          ...((cursor ? { cursor } : {}) as Prisma.ActionsWhereUniqueInput),
        },
      })
      .pipe(
        tap((val) => {
          ctx.setState({
            loading: false,
            queue: [...state.queue, ...val],
          });
        })
      );
  }

  @Action(UnloadQueue)
  unloadQueue(ctx: StateContext<QueueStateModel>) {
    ctx.setState({
      loading: false,
      queue: [],
    });
  }

  @Action(SaveQueue)
  saveQueue(ctx: StateContext<QueueStateModel>, action: SaveQueue) {
    return this.http
      .put(`${environment.API_URL}/actions/${action.payload.queueId}`, {
        approved: action.payload.approved,
      })
      .pipe(
        tap(() => {
          const state = ctx.getState();
          ctx.patchState({
            queue: state.queue.filter((q) => q.id !== action.payload.queueId),
          });
        })
      );
  }
}
