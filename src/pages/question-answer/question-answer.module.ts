import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionAnswerPage } from './question-answer';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    QuestionAnswerPage,
  ],
    imports: [
        IonicPageModule.forChild(QuestionAnswerPage),
        TranslateModule,
    ],
})
export class QuestionAnswerPageModule {}
