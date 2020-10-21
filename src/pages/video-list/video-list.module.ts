import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideoListPage } from './video-list';
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    VideoListPage,
  ],
    imports: [
        IonicPageModule.forChild(VideoListPage),
        DirectivesModule,
    ],
})
export class VideoListPageModule {}
