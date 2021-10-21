import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { FooterAdminComponent } from './footer-admin/footer-admin.component';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { HeaderStatsModule } from './header-stats/header-stats.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { AdminNavbarModule } from './admin-navbar/admin-navbar.module';

@NgModule({
  declarations: [
    AdminComponent,
    FooterAdminComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    HeaderStatsModule,
    SidebarModule,
    AdminNavbarModule
  ],
  exports: [],
  providers: [],
})
export class AdminModule {}
