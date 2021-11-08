export function channelToUsername(channel: string, prefix = "@") {
  return `${prefix}${channel.substr(1, channel.length)}`;
}
