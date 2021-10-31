import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { SettingsState } from "./settings.state";

@NgModule({
  imports: [NgxsModule.forFeature([SettingsState])],
  providers: [SettingsState]
})
export class SettingsStateModule {
}
