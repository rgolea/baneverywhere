export class LoadFollows {
  static readonly type = '[FOLLOWS] Load follows';
}

export class LoadMoreFollows {
  static readonly type = '[FOLLOWS] Load more follows';
  constructor(
    public payload: { first: number; after?: string } = { first: 20 }
  ) {}
}
