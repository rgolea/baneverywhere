import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('bot')
export class BotProcessor {
  private readonly logger = new Logger(BotProcessor.name);

  @Process('ban')
  handleBot(job: Job) {
    // console.log(job);
    this.logger.debug('Start banning...');
    this.logger.debug(job.data);
    console.log(job.data);
    this.logger.debug('Banning completed');
  }
}
