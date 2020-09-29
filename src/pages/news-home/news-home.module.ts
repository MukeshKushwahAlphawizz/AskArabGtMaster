import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsHomePage } from './news-home';
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    NewsHomePage,
  ],
    imports: [
        IonicPageModule.forChild(NewsHomePage),
        DirectivesModule,
    ],
})
export class NewsHomePageModule {}
