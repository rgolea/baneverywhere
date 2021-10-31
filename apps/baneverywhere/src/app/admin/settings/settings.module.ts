import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardSettingsComponent } from './card-settings/card-settings.component';
import { CardProfileComponent } from './card-profile/card-profile.component';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { NgxsModule } from '@ngxs/store';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SettingsStateModule } from '../../store/settings/settings-state.module';

@NgModule({
  declarations: [
    CardSettingsComponent,
    CardProfileComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    NgxsModule,
    SweetAlert2Module,
    SettingsStateModule,
  ],
  exports: [],
  providers: [],
})
export class SettingsModule {}
