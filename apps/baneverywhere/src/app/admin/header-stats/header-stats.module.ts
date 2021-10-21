import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderStatsComponent } from './header-stats.component';
import { CardStatsComponent } from './card-stats/card-stats.component';

@NgModule({
  declarations: [HeaderStatsComponent, CardStatsComponent],
  imports: [ CommonModule ],
  exports: [ HeaderStatsComponent ],
  providers: [],
})
export class HeaderStatsModule {}
