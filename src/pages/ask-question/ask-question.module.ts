import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AskQuestionPage } from './ask-question';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    AskQuestionPage,
  ],
    imports: [
        IonicPageModule.forChild(AskQuestionPage),
        TranslateModule,
    ],
})
export class AskQuestionPageModule {}
