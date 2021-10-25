import { TwitchUserProfile } from "@baneverywhere/api-interfaces";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const TwitchProfile = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request['user'] as TwitchUserProfile;
});
