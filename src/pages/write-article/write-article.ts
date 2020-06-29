import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the WriteArticlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-write-article',
  templateUrl: 'write-article.html',
})
export class WriteArticlePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl:ViewController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WriteArticlePage');
  }

  openMyProfile() {
    this.navCtrl.push('MyProfilePage');
  }

  postArticle() {
    this.viewCtrl.dismiss();
  }
}
