import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  private readonly machineStatus = new Map<string, number>();

  setOrUpdateMachineStatus(id: string, status: number) {
    this.machineStatus.set(id, status);
    console.log(this.machineStatus);
  }

  removeMachineStatus(id: string){
    this.machineStatus.delete(id);
    console.log(this.machineStatus);
  }

  getMachineWithLowerStatus() {
    const MAX_USERS_PER_BOT =
      parseInt(this.configService.get<string>('MAX_USERS_PER_BOT')) || 1000;
    return [...this.machineStatus]
      .filter((state) => state[1] < MAX_USERS_PER_BOT)
      .reduce((a, b) => (a[1] < b[1] ? a : b));
  }
}
