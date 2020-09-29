import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ArticleDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-article-detail',
  templateUrl: 'article-detail.html',
})
export class ArticleDetailPage {
  tagList: any = [
    {
      name: 'ACURA',
    },
    {
      name: 'ALPHA ROMEO',
    },
    {
      name: 'AUDI',
    },
    {
      name: 'BMW',
    },
    {
      name: 'BENTLEY',
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArticleDetailPage');
  }

  selectTag(cat: any) {

  }
}
