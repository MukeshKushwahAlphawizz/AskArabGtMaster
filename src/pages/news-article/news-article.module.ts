import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsArticlePage } from './news-article';

@NgModule({
  declarations: [
    NewsArticlePage,
  ],
  imports: [
    IonicPageModule.forChild(NewsArticlePage),
  ],
})
export class NewsArticlePageModule {}
