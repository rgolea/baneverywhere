import {
  BanEverywhereSettings,
  TwitchUserSettings,
} from '@baneverywhere/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SettingsDocument, SettingsModel } from './settings.model';
import { Omit } from 'utility-types';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(SettingsModel.name)
    private readonly settingsModel: Model<SettingsDocument>
  ) {}

  async findOneOrCreateSettings({
    fromId,
    toId,
  }: Omit<TwitchUserSettings, 'settings'>): Promise<SettingsDocument> {
    let settings = await this.settingsModel.findOne({ fromId, toId });
    if (settings) return settings;
    settings = await this.settingsModel.create({
      fromId,
      toId,
      settings: BanEverywhereSettings.NONE,
    });
    return settings;
  }

  async createOrUpdateSettings(
    config: TwitchUserSettings
  ): Promise<SettingsDocument> {
    return await this.settingsModel.findOneAndUpdate(
      { fromId: config.fromId, toId: config.toId },
      { settings: config.settings },
      { upsert: true, new: true }
    );
  }
}
