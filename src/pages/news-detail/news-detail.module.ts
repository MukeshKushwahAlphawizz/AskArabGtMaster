import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsDetailPage } from './news-detail';
import {DirectivesModule} from "../../directives/directives.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    NewsDetailPage,
  ],
    imports: [
        IonicPageModule.forChild(NewsDetailPage),
        DirectivesModule,
        TranslateModule,
    ],
})
export class NewsDetailPageModule {}
