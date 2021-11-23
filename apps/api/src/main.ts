/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { BotDatabaseService } from "@baneverywhere/db";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

(async () => {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });

  app.setGlobalPrefix('/api')

  const express = app.getHttpAdapter().getInstance();

  Sentry.init({
    dsn: "https://84cdc42e1de54a42abe9354099956219@o1069891.ingest.sentry.io/6065258",
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app: express }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  express.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  express.use(Sentry.Handlers.tracingHandler());

  // The error handler must be before any other error middleware and after all controllers
  express.use(Sentry.Handlers.errorHandler());

  const dbService = app.get(BotDatabaseService);

  dbService.enableShutdownHooks(app);

  const port = process.env.PORT || 3333;
  await app.listen(port, async () => {
    Logger.log('Listening at http://localhost:' + port + '/');
  });
})();
