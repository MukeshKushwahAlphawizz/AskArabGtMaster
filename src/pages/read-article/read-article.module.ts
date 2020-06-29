import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReadArticlePage } from './read-article';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    ReadArticlePage,
  ],
    imports: [
        IonicPageModule.forChild(ReadArticlePage),
        TranslateModule,
    ],
})
export class ReadArticlePageModule {}
