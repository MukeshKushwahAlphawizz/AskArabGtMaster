import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideoDetailPage } from './video-detail';
import {DirectivesModule} from "../../directives/directives.module";
import {PipesModule} from "../../pipes/pipes.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    VideoDetailPage,
  ],
    imports: [
        IonicPageModule.forChild(VideoDetailPage),
        DirectivesModule,
        PipesModule,
        TranslateModule,
    ],
})
export class VideoDetailPageModule {}
