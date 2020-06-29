import { NgModule } from '@angular/core';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { SettingsPage } from './settings';
import {HttpClient} from "@angular/common/http";
import {createTranslateLoader} from "../../app/app.module";

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPage),
    TranslateModule.forChild(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    SettingsPage
  ]
})
export class SettingsPageModule { }
