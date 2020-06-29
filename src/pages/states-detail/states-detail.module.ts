import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatesDetailPage } from './states-detail';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    StatesDetailPage,
  ],
    imports: [
        IonicPageModule.forChild(StatesDetailPage),
        TranslateModule,
    ],
})
export class StatesDetailPageModule {}
