import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionDetailPage } from './question-detail';
import {PipesModule} from "../../pipes/pipes.module";
import {TranslateModule} from "@ngx-translate/core";
import {ProgressBarModule} from "angular-progress-bar";

@NgModule({
  declarations: [
    QuestionDetailPage,
  ],
    imports: [
        IonicPageModule.forChild(QuestionDetailPage),
        PipesModule,
        TranslateModule,
        ProgressBarModule,
    ],
})
export class QuestionDetailPageModule {}
