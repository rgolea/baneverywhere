import { TwitchUserProfile } from "@baneverywhere/api-interfaces";
import { Prop } from "@nestjs/mongoose";

export class UserModel implements TwitchUserProfile {
  @Prop({
    required: true,
    text: true
  })
  login: string;

  @Prop({
    required: true,
    text: true
  })
  display_name: string;

  @Prop({
    required: true,
    text: true
  })
  twitchId: string;

  @Prop({
    required: true,
    text: true
  })
  profile_image_url: string;
}
