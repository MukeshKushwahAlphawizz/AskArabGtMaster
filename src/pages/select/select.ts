import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-select',
  templateUrl: 'select.html',
})
export class SelectPage {

  constructor(public navCtrl: NavController,
              public storage:Storage,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  goCategory() {
    this.storage.get('selectedCategories').then(data=>{
      if (data){
        this.navCtrl.push('NewsTabsPage');
      }else {
        this.navCtrl.push('SelectCategoryPage');
      }
    })
  }

  goMenuPage() {
    this.navCtrl.push('MenuPage');
  }
}
