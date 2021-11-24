import { BotStatus } from '@baneverywhere/bot-interfaces';
import { BotDatabaseService } from '@baneverywhere/db';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { logError } from "@baneverywhere/error-handler";

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dbService: BotDatabaseService
  ) {}

  private readonly machineStatus = new Map<string, BotStatus>();
  private readonly userByMachine = new Map<string, string>();

  @logError()
  async setOrUpdateMachineStatus(id: string, status: BotStatus) {
    await this.removeMachineStatus(id);
    this.machineStatus.set(id, status);
    if(!status?.count) return;
    await this.dbService.channels.deleteMany({
      where: {
        machine: id
      }
    })
    await this.dbService.channels.createMany({
      data: status.users.map(user => ({
        machine: id,
        username: user,
      }))
    });
  }

  @logError()
  async removeMachineStatus(id: string){
    this.machineStatus.delete(id);
    const count = await this.dbService.channels.count({
      where: {
        machine: id,
      }
    });
    if(!count) return;
    await this.dbService.channels.deleteMany({
      where: {
        machine: id
      }
    });
  }

  async preassignMachineToUser(user: string): Promise<string> {
    const MAX_USERS_PER_BOT =
      parseInt(this.configService.get<string>('MAX_USERS_PER_BOT')) || 1000;

    const alreadyAssigned = this.userByMachine.has(`#${user}`);
    if (alreadyAssigned) return;
    const machine = [...this.machineStatus]
      .filter((state) => (state[1]?.count || 0) < MAX_USERS_PER_BOT)
      .reduce((a, b) => (a[1]?.count < b[1]?.count ? a : b), []);

    if (!machine) return;
    const id = machine[0];
    if(!id || !machine[1]) return;

    const users = machine[1]?.users;
    this.setOrUpdateMachineStatus(id, {
      users: [...users, `#${user}`],
      count: users.length + 1,
    });
    return id;
  }
}
