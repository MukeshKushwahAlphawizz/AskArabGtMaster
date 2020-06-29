import { NgModule } from '@angular/core';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { TabsPage } from './tabs';
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
    TranslateModule.forChild(),
    /*TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),*/
  ],
  exports: [
    TabsPage
  ]
})
export class TabsPageModule { }
