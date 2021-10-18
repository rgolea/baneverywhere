import { Component, Input } from '@angular/core';

@Component({
  selector: 'baneverywhere-footer-small',
  templateUrl: './footer-small.component.html',
})
export class FooterSmallComponent {
  date = new Date().getFullYear();

  @Input()
  get absolute(): boolean {
    return this._absolute;
  }
  set absolute(absolute: boolean) {
    this._absolute = absolute === undefined ? false : absolute;
  }
  private _absolute = false;
}
