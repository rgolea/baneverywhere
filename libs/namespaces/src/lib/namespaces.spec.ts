import { BOT_CONNECTION, BOT_HANDLER_CONNECTION } from './namespaces';

describe('namespaces', () => {
  it('should exist a bot connection', () => {
    expect(BOT_CONNECTION).toBeDefined();
    expect(BOT_HANDLER_CONNECTION).toBeDefined();
  });
});
