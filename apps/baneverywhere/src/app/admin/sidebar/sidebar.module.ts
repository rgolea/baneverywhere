import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { RouterModule } from "@angular/router";
import { UserDropdownModule } from '../user-dropdown/user-dropdown.module';

@NgModule({
  declarations: [SidebarComponent],
  imports: [ CommonModule, RouterModule, UserDropdownModule ],
  exports: [ SidebarComponent ],
  providers: [],
})
export class SidebarModule {}
