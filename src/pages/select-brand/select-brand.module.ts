import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectBrandPage } from './select-brand';

@NgModule({
  declarations: [
    SelectBrandPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectBrandPage),
  ],
})
export class SelectBrandPageModule {}
