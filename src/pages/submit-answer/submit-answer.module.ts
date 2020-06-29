import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubmitAnswerPage } from './submit-answer';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    SubmitAnswerPage,
  ],
    imports: [
        IonicPageModule.forChild(SubmitAnswerPage),
        TranslateModule,
    ],
})
export class SubmitAnswerPageModule {}
