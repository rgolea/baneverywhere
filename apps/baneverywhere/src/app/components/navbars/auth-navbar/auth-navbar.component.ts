import { Component } from '@angular/core';

@Component({
  selector: 'baneverywhere-auth-navbar',
  templateUrl: './auth-navbar.component.html',
})
export class AuthNavbarComponent {
  navbarOpen = false;

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }
}
