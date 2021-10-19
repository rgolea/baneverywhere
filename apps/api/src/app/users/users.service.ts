import { Global, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from './user.model';
import { Model } from 'mongoose';
import { TwitchUserProfile } from "@baneverywhere/api-interfaces";

@Global()
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>
  ){}

  async createOrUpdateUser(profile: TwitchUserProfile): Promise<UserDocument> {
    return await this.userModel.findOneAndUpdate({
      login: profile.login
    }, {
      ...profile
    }, {
      upsert: true,
      new: true
    });
  }
}
