/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { BotDatabaseService } from "@baneverywhere/db";

(async () => {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });

  const dbService = app.get(BotDatabaseService);

  dbService.enableShutdownHooks(app);

  const port = process.env.PORT || 3333;
  await app.listen(port, async () => {
    Logger.log('Listening at http://localhost:' + port + '/');
  });
})();
