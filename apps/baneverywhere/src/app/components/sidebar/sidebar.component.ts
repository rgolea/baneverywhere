import { Component } from '@angular/core';

@Component({
  selector: 'baneverywhere-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  collapseShow = 'hidden';
  toggleCollapseShow(classes) {
    this.collapseShow = classes;
  }
}
