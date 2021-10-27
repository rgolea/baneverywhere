import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './auth.state';

@NgModule({
  imports: [NgxsModule.forFeature([AuthState])],
  providers: [AuthState],
})
export class AuthStateModule {}
