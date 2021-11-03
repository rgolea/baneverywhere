import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsController } from './settings.controller';
import { SettingsModel, SettingsSchema } from './settings.model';
import { SettingsService } from './settings.service';

@Module({
  controllers: [SettingsController],
  imports: [
    MongooseModule.forFeature([
      { name: SettingsModel.name, schema: SettingsSchema },
    ]),
  ],
  providers: [SettingsService],
})
export class SettingsModule {}
