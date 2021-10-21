import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDropdownComponent } from './user-dropdown.component';

@NgModule({
  declarations: [UserDropdownComponent],
  imports: [ CommonModule ],
  exports: [UserDropdownComponent],
  providers: [],
})
export class UserDropdownModule {}
