import { INestApplication, INestMicroservice, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from "@prisma/client";

@Injectable()
export class BotDatabaseService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }

  async enableShutdownHooks(app: INestApplication | INestMicroservice) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
