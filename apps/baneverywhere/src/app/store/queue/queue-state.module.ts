import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { QueueState } from "./queue.state";

@NgModule({
  imports: [NgxsModule.forFeature([QueueState])],
  providers: [QueueState]
})
export class QueueStateModule {}
