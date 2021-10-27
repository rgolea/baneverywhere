import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { FollowsState } from './follows.state';

@NgModule({
  declarations: [],
  imports: [ NgxsModule.forFeature([FollowsState]) ],
  exports: [],
  providers: [FollowsState],
})
export class FollowsStateModule {}
