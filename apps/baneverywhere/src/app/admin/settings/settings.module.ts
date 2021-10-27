import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardSettingsComponent } from './card-settings/card-settings.component';
import { CardProfileComponent } from './card-profile/card-profile.component';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  declarations: [
    CardSettingsComponent,
    CardProfileComponent,
    SettingsComponent
  ],
  imports: [ CommonModule, SettingsRoutingModule, NgxsModule ],
  exports: [],
  providers: [],
})
export class SettingsModule {}
