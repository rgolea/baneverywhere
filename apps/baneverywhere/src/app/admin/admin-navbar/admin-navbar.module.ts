import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from './admin-navbar.component';
import { UserDropdownModule } from '../user-dropdown/user-dropdown.module';

@NgModule({
  declarations: [AdminNavbarComponent],
  imports: [ CommonModule, UserDropdownModule ],
  exports: [AdminNavbarComponent],
  providers: [],
})
export class AdminNavbarModule {}
