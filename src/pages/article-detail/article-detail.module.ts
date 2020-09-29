import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticleDetailPage } from './article-detail';
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    ArticleDetailPage,
  ],
    imports: [
        IonicPageModule.forChild(ArticleDetailPage),
        DirectivesModule,
    ],
})
export class ArticleDetailPageModule {}
