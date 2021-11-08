/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false
  });
  await app.listen(0, async () => {
    Logger.log(`Listening at ${await app.getUrl()}`);
  });
}

bootstrap();
