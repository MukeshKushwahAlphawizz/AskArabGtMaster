import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionAnswerDetailPage } from './question-answer-detail';
import {TranslateModule} from "@ngx-translate/core";
import {ProgressBarModule} from "angular-progress-bar";

@NgModule({
  declarations: [
    QuestionAnswerDetailPage,
  ],
    imports: [
        IonicPageModule.forChild(QuestionAnswerDetailPage),
        TranslateModule,
        ProgressBarModule,
    ],
})
export class QuestionAnswerDetailPageModule {}
