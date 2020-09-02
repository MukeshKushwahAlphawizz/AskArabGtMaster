import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectCategoryPage } from './select-category';

@NgModule({
  declarations: [
    SelectCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectCategoryPage),
  ],
})
export class SelectCategoryPageModule {}
