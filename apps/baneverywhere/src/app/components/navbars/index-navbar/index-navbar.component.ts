import { Component } from '@angular/core';

@Component({
  selector: 'baneverywhere-index-navbar',
  templateUrl: './index-navbar.component.html',
})
export class IndexNavbarComponent {
  navbarOpen = false;

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }
}
