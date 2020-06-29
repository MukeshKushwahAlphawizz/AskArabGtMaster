import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionUserPage } from './question-user';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    QuestionUserPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionUserPage),
    TranslateModule,
  ],
})
export class QuestionUserPageModule {}
