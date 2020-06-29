import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WriteArticlePage } from './write-article';

@NgModule({
  declarations: [
    WriteArticlePage,
  ],
  imports: [
    IonicPageModule.forChild(WriteArticlePage),
  ],
})
export class WriteArticlePageModule {}
