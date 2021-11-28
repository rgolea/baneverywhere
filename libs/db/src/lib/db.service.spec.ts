import { Test } from '@nestjs/testing';
import { BotDatabaseService } from './db.service';

describe('BotDatabaseService', () => {
  let service: BotDatabaseService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BotDatabaseService],
    }).compile();

    service = module.get(BotDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('should have an `enableShutdownHooks` that calls the app if the db goes down', async () => {
    expect(service.enableShutdownHooks).toBeDefined();
  });

  it('should connect on init', () => {
    const $connect = jest.spyOn(service, '$connect').mockImplementation(() => Promise.resolve());
    service.onModuleInit();
    expect($connect).toHaveBeenCalled();
  });
});
