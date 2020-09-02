import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ViewController} from "ionic-angular/index";

@IonicPage()
@Component({
  selector: 'page-select-category',
  templateUrl: 'select-category.html',
})
export class SelectCategoryPage {

  categoryList:any=[
    {
      name: 'ACURA',
      isSelected:false
    },
    {
      name: 'ALPHA ROMEO',
      isSelected:false
    },
    {
      name: 'AUDI',
      isSelected:false
    },
    {
      name: 'BMW',
      isSelected:false
    },
    {
      name: 'BENTLEY',
      isSelected:false
    },
    {
      name: 'BUICK',
      isSelected:false
    },
    {
      name: 'ACURA',
      isSelected:false
    },
    {
      name: 'AUDI',
      isSelected:false
    },
    {
      name: 'ALPHA ROMEO',
      isSelected:false
    },
    {
      name: 'BMW',
      isSelected:false
    },
    {
      name: 'BUICK',
      isSelected:false
    },
    {
      name: 'BENTLEY',
      isSelected:false
    }
  ]
  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  selectCategory(cat: any) {
    cat.isSelected?cat.isSelected=false:cat.isSelected=true;
  }

  back() {
    this.viewCtrl.dismiss();
  }

  goNewsHome() {
    this.navCtrl.push('NewsTabsPage');
  }
}
