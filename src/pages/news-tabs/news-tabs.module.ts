import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsTabsPage } from './news-tabs';

@NgModule({
  declarations: [
    NewsTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(NewsTabsPage),
  ],
})
export class NewsTabsPageModule {}
