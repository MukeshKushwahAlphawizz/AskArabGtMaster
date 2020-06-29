import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticlePage } from './article';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    ArticlePage,
  ],
    imports: [
        IonicPageModule.forChild(ArticlePage),
        TranslateModule,
    ],
})
export class ArticlePageModule {}
