import { BanEverywhereSettings } from "@prisma/client";

export class LoadSettingsForUser {
  static readonly type = '[Settings] Load Settings For User';
  constructor(public payload: { twitchId: string }) {}
}

export class UnloadSettings {
  static readonly type = '[Settings] Unload Settings';
}

export class SaveSettings {
  static readonly type = '[Settings] Save Settings';
  constructor(public payload: { settings: BanEverywhereSettings }) {}
}
