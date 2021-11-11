import { Test, TestingModule } from '@nestjs/testing';
import { TwitchClientService } from './twitch-client.service';

describe('TwitchClientService', () => {
  let service: TwitchClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwitchClientService],
    }).compile();

    service = module.get<TwitchClientService>(TwitchClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
