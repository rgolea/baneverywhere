import { Action } from '@prisma/client';

export class LoadQueueForUser {
  static readonly type = '[Queue] Load Queue For User';
  constructor(public payload: { type: Action }) {}
}

export class UnloadQueue {
  static readonly type = '[Queue] Unload Queue';
}

export class SaveQueue {
  static readonly type = '[Queue] Save Queue';
  constructor(public payload: { queueId: string; approved: boolean }) {}
}
