import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BanEverywhereSettings, TwitchUserSettings } from '@baneverywhere/api-interfaces';
import { Document } from 'mongoose';

export type SettingsDocument = SettingsModel & Document;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  collection: 'settings',
})
export class SettingsModel implements TwitchUserSettings {
  @Prop({ required: true, type: String, index: 'hashed' })
  fromId: string;

  @Prop({ required: true, type: String, index: 'hashed' })
  toId: string;

  @Prop({
    required: true,
    default: BanEverywhereSettings.NONE,
    enum: BanEverywhereSettings,
    type: String,
  })
  settings: BanEverywhereSettings;
}

export const SettingsSchema = SchemaFactory.createForClass(SettingsModel);
