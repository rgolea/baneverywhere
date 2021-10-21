import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { RouterModule } from "@angular/router";
import { NotificationDropdownComponent } from './notification-dropdown/notification-dropdown.component';
import { UserDropdownModule } from '../user-dropdown/user-dropdown.module';

@NgModule({
  declarations: [SidebarComponent, NotificationDropdownComponent],
  imports: [ CommonModule, RouterModule, UserDropdownModule ],
  exports: [ SidebarComponent ],
  providers: [],
})
export class SidebarModule {}
