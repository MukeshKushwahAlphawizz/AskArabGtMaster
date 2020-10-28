import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsMenuPage } from './news-menu';

@NgModule({
  declarations: [
    NewsMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(NewsMenuPage),
  ],
})
export class NewsMenuPageModule {}
