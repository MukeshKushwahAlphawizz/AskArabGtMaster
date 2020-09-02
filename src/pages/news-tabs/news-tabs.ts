import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Tabs} from "ionic-angular/index";


@IonicPage()
@Component({
  selector: 'page-news-tabs',
  templateUrl: 'news-tabs.html',
})
export class NewsTabsPage {
  @ViewChild('newstabs') newstabs: Tabs;
  tabIndex: any = 0;
  tab1Title: any = 'NEWS';
  tab2Title: any = 'ARTICLES';

  tab1Root: any = 'NewsHomePage';
  tab2Root: any = 'NewsArticlePage';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

}
