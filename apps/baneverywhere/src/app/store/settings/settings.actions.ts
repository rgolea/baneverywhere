export class LoadSettingsForUser {
  static readonly type = '[Settings] Load Settings For User';
  constructor(public payload: { twitchId: string }) {}
}
