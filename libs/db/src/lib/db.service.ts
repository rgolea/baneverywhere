import { INestApplication, INestMicroservice, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from "@prisma/client";
import { logError } from "@baneverywhere/error-handler";

@Injectable()
export class BotDatabaseService extends PrismaClient implements OnModuleInit {
  @logError()
  onModuleInit() {
    this.$connect();
  }

  @logError()
  async enableShutdownHooks(app: INestApplication | INestMicroservice) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
