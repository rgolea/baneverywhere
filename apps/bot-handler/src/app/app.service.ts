import { BotStatus } from '@baneverywhere/bot-interfaces';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  private readonly machineStatus = new Map<string, BotStatus>();
  private readonly userByMachine = new Map<string, string>();

  setOrUpdateMachineStatus(id: string, status: BotStatus) {
    const oldStatus = this.machineStatus.get(id);
    if(oldStatus) {
      oldStatus.users?.forEach(user => {
        this.userByMachine.delete(user);
      });
    }
    this.machineStatus.set(id, status);
    status?.users?.forEach(user => {
      this.userByMachine.set(user, id);
    });
  }

  removeMachineStatus(id: string){
    const status: BotStatus = this.machineStatus.get(id);
    this.machineStatus.delete(id);
    status?.users?.forEach(user => {
      this.userByMachine.delete(user);
    });
  }

  preassignMachineToUser(user: string): string {
    const MAX_USERS_PER_BOT =
      parseInt(this.configService.get<string>('MAX_USERS_PER_BOT')) || 1000;

    const alreadyAssigned = this.userByMachine.has(`#${user}`);
    if (alreadyAssigned) return;
    const machine = [...this.machineStatus]
      .filter((state) => state[1].count < MAX_USERS_PER_BOT)
      .reduce((a, b) => (a[1].count < b[1].count ? a : b));

    const id = machine[0];
    if(!id) return;

    const users = machine[1].users;
    this.setOrUpdateMachineStatus(id, {
      users: [...users, `#${user}`],
      count: users.length + 1,
    });
    return id;
  }
}
