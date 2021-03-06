import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticleDetailPage } from './article-detail';
import {DirectivesModule} from "../../directives/directives.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    ArticleDetailPage,
  ],
    imports: [
        IonicPageModule.forChild(ArticleDetailPage),
        DirectivesModule,
        TranslateModule,
    ],
})
export class ArticleDetailPageModule {}
