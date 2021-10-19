import { TwitchUserProfile } from '@baneverywhere/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserModel & Document;
@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  collection: 'users'
})
export class UserModel implements TwitchUserProfile {
  @Prop({
    required: true,
    text: true,
    index: 'hashed'
  })
  login: string;

  @Prop({
    required: true,
    text: true,
  })
  display_name: string;

  @Prop({
    required: true,
    text: true,
  })
  twitchId: string;

  @Prop({
    required: true,
    text: true,
  })
  profile_image_url: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
