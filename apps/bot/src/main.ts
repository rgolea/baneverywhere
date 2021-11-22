/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  console.log(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }
  });

  app.enableShutdownHooks();

  app.listen().then(() => Logger.log('Microservice is listening'));
}

bootstrap();
