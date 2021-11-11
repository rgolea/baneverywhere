import { Module, Global } from '@nestjs/common';
import { BotDatabaseService } from './db.service';

@Global()
@Module({
  controllers: [],
  providers: [BotDatabaseService],
  exports: [BotDatabaseService],
})
export class BotDatabaseModule {}
