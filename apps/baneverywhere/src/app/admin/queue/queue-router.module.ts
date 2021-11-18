import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QueueComponent } from './queue.component';

const routes: Routes = [{ path: '', component: QueueComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueueRoutingModule {}
