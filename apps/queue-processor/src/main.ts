/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { BotDatabaseService } from '@baneverywhere/db';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
    }
  );

  const dbService = app.get(BotDatabaseService);

  dbService.enableShutdownHooks(app);

  app.listen().then(() => Logger.log('Microservice is listening'));
}

bootstrap();
