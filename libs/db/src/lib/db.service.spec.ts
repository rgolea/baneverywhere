import { Test } from '@nestjs/testing';
import { DbService } from './db.service';

describe('DbService', () => {
  let service: DbService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DbService],
    }).compile();

    service = module.get(DbService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
