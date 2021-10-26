import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { createPopper } from '@popperjs/core';
import { Observable } from 'rxjs';
import { AuthState, AuthStateModel } from '../../store/auth/auth.state';

@Component({
  selector: 'baneverywhere-user-dropdown',
  templateUrl: './user-dropdown.component.html',
})
export class UserDropdownComponent implements OnInit, AfterViewInit {
  @Select(AuthState) auth$: Observable<AuthStateModel>;
  dropdownPopoverShow = false;
  @ViewChild('btnDropdownRef', { static: false }) btnDropdownRef: ElementRef;
  @ViewChild('popoverDropdownRef', { static: false })
  popoverDropdownRef: ElementRef;

  constructor(
    private readonly store: Store
  ){}

  ngOnInit(){
    this.auth$ = this.store.select(state => state.auth);
  }

  ngAfterViewInit() {
    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: 'bottom-start',
      }
    );
  }
  toggleDropdown(event) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
    }
  }
}
