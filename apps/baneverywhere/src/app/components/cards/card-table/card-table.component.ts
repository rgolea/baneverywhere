import { Component, Input } from '@angular/core';

@Component({
  selector: 'baneverywhere-card-table',
  templateUrl: './card-table.component.html',
})
export class CardTableComponent {
  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== 'light' && color !== 'dark' ? 'light' : color;
  }
  private _color = 'light';
}
