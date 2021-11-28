import { BotDatabaseService } from '@baneverywhere/db';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { logError } from '@baneverywhere/error-handler';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dbService: BotDatabaseService
  ) {}

  @logError()
  async preassignMachineToUser(username: string): Promise<string> {
    const user = await this.dbService.user.findUnique({
      select: {
        machineUUID: true,
      },
      where: {
        login: username,
      }
    });

    if (user.machineUUID) return;

    const machinesWithCount = await this.dbService.machine.findMany({
      select: {
        uuid: true,
        _count: {
          select: {
            users: true,
          }
        }
      },
      orderBy: {
        users: {
          _count: 'asc'
        }
      },
      take: 1,
    });

    const MAX_USERS_PER_BOT =
      parseInt(this.configService.get<string>('MAX_USERS_PER_BOT')) || 1000;

    const machine = machinesWithCount.find(m => m._count.users < MAX_USERS_PER_BOT);

    if(!machine) throw new Error('No machine available');
    await this.dbService.user.update({
      where: {
        login: username,
      },
      data: {
        machineUUID: machine.uuid,
      }
    });

    return machine.uuid;
  }
}
