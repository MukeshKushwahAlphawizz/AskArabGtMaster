import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ViewController} from "ionic-angular/index";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-select-category',
  templateUrl: 'select-category.html',
})
export class SelectCategoryPage {
  categoryList:any=[
    {
      name: 'BMW',
      isSelected:false
    },
    {
      name: 'MERCEDES',
      isSelected:false
    },
    {
      name: 'AUDI',
      isSelected:false
    },
    {
      name: 'CHEVROLET',
      isSelected:false
    },
    {
      name: 'KIA',
      isSelected:false
    },
    {
      name: 'HYUNDAI',
      isSelected:false
    },
    {
      name: 'RANGE ROVER',
      isSelected:false
    },
    {
      name: 'JAGUAR',
      isSelected:false
    },
    {
      name: 'ALPHA ROMEO',
      isSelected:false
    },
    {
      name: 'BENTLEY',
      isSelected:false
    }
  ]
  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public storage: Storage,
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
    let categories:any = [];
    this.categoryList.filter(item=>{
      if (item.isSelected){
        categories.push(item.name);
      }
    });
    this.storage.set('selectedCategories',categories).then(()=>{
      this.navCtrl.setRoot('NewsTabsPage');
    });
  }
}
