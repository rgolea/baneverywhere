import { Test, TestingModule } from '@nestjs/testing';
import { BotClientService } from './bot-client.service';

describe('BotClientService', () => {
  let service: BotClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotClientService],
    }).compile();

    service = module.get<BotClientService>(BotClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
