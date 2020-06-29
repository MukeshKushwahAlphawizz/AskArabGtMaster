import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactUsPage } from './contact-us';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    ContactUsPage,
  ],
    imports: [
        IonicPageModule.forChild(ContactUsPage),
        TranslateModule,
    ],
})
export class ContactUsPageModule {}
