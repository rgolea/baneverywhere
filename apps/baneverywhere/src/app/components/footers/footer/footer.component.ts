import { Component } from '@angular/core';

@Component({
  selector: 'baneverywhere-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  date = new Date().getFullYear();
}
