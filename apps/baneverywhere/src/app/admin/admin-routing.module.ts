import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: 'queue',
        loadChildren: () => import('./queue/queue.module').then((m) => m.QueueModule),
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'settings'
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'admin/settings'
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
