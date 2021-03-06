import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsArticlePage } from './news-article';
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    NewsArticlePage,
  ],
    imports: [
        IonicPageModule.forChild(NewsArticlePage),
        DirectivesModule,
    ],
})
export class NewsArticlePageModule {}
