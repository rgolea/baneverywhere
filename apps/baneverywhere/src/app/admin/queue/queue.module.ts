import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueComponent } from './queue.component';
import { CardTableComponent } from './card-table/card-table.component';
import { QueueRoutingModule } from './queue-router.module';
import { QueueStateModule } from '../../store/queue/queue-state.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [QueueComponent, CardTableComponent],
  imports: [CommonModule, QueueRoutingModule, QueueStateModule, SweetAlert2Module.forChild()],
  exports: [],
  providers: [],
})
export class QueueModule {}
