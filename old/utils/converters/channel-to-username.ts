export function channelToUsername(channel: string, prefix: string = "@") {
  return `${prefix}${channel.substr(1, channel.length)}`;
}
