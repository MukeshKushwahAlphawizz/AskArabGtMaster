import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsHomePage } from './news-home';

@NgModule({
  declarations: [
    NewsHomePage,
  ],
  imports: [
    IonicPageModule.forChild(NewsHomePage),
  ],
})
export class NewsHomePageModule {}
