export class LoadFollows {
  static readonly type = '[FOLLOWS] Load follows';
}

export class LoadMoreFollows {
  static readonly type = '[FOLLOWS] Load more follows';
  constructor(
    public payload?: { after?: string }
  ) {}
}

export class UnloadFollows {
  static readonly type = '[FOLLOWS] Unload follows';
}
