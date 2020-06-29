import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangePasswordPage } from './change-password';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    ChangePasswordPage,
  ],
    imports: [
        IonicPageModule.forChild(ChangePasswordPage),
        TranslateModule,
    ],
})
export class ChangePasswordPageModule {}
