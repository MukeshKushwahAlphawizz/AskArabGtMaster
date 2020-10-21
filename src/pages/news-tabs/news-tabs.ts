import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {App, Tabs} from "ionic-angular/index";
import {Storage} from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-news-tabs',
  templateUrl: 'news-tabs.html',
})
export class NewsTabsPage {
  @ViewChild('newstabs') newstabs: Tabs;
  tabIndex: any = 1;
  tab1Title: any = 'أخبار';
  tab2Title: any = 'مقالات';
  tab3Title: any = 'أشرطة فيديو';
  tab4Title: any = 'Q&A';

  tab1Root: any = 'NewsHomePage';
  tab2Root: any = 'NewsArticlePage';
  tab3Root: any = 'VideoListPage';
  tab4Root: any = '';

  constructor(public navCtrl: NavController,
              public storage : Storage,
              public app: App,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  home() {
    this.storage.get('userData').then(data=>{
        if(data){
          this.app.getRootNav().push('MenuPage');
        }else {
          this.app.getRootNav().push('LoginPage');
        }
      });
  }
}
