import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDropdownComponent } from './user-dropdown.component';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  declarations: [UserDropdownComponent],
  imports: [ CommonModule, NgxsModule ],
  exports: [UserDropdownComponent],
  providers: [],
})
export class UserDropdownModule {}
