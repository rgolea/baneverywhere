import { Component } from '@angular/core';

@Component({
  selector: 'baneverywhere-footer-admin',
  templateUrl: './footer-admin.component.html',
})
export class FooterAdminComponent {
  date = new Date().getFullYear();
}
