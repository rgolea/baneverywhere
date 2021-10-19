/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

(async () => {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });
  const port = process.env.PORT || 3333;
  await app.listen(port, async () => {
    Logger.log('Listening at http://localhost:' + port + '/');
  });
})();