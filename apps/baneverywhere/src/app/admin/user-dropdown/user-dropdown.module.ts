import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDropdownComponent } from './user-dropdown.component';
import { NgxsModule } from '@ngxs/store';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [UserDropdownComponent],
  imports: [ CommonModule, NgxsModule, RouterModule ],
  exports: [UserDropdownComponent],
  providers: [],
})
export class UserDropdownModule {}
