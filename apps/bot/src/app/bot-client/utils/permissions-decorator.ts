import {
  CommandOrigins,
  CommandExecutor,
  AnonymousCommandExecutor,
} from 'tmijs-commander';
import { channelToUsername } from './channel-to-username';
export enum Roles {
  MODERATOR = 'MODERATOR',
  STREAMER = 'STREAMER',
  USER = 'USER',
}

export type ValidationConfig = Partial<
  Record<Roles, boolean | ((author: CommandOrigins['author']) => boolean)>
>;

export function Validate(config: ValidationConfig): MethodDecorator {
  return function (
    _: CommandExecutor,
    __: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod: AnonymousCommandExecutor = descriptor.value;
    descriptor.value = async function (origin: CommandOrigins): Promise<void> {
      const { channel, author } = origin;
      let role = Roles.USER;
      if (author.mod) {
        role = Roles.MODERATOR;
      }
      if (author.username === channelToUsername(channel, '')) {
        role = Roles.STREAMER;
      }

      const hasRoles = () => {
        switch (typeof config[role]) {
          case 'boolean':
            return config[role];
          case 'function':
            return (
              config[role] as (author: CommandOrigins['author']) => boolean
            )(author);
          default:
            return false;
        }
      };
      if (!hasRoles()) {
        return;
      }

      return originalMethod.call(this, origin);
    };

    return descriptor;
  };
}
