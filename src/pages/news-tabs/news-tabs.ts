import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {App, Events, Tabs} from "ionic-angular/index";
import {Storage} from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-news-tabs',
  templateUrl: 'news-tabs.html',
})
export class NewsTabsPage {
  @ViewChild('newstabs') newstabs: Tabs;
  tabIndex: any = 3;
  tab1Title: any = 'أخبار';
  tab2Title: any = 'تقارير';
  tab3Title: any = 'فيديو';
  tab4Title: any = 'المنتدى';

  tab1Root: any = 'NewsHomePage';
  tab2Root: any = 'NewsArticlePage';
  tab3Root: any = 'VideoListPage';
  tab4Root: any = '';

  constructor(public navCtrl: NavController,
              public storage : Storage,
              public app: App,
              public events: Events,
              public navParams: NavParams) {
    events.subscribe('sequence',value=>{
      this.setTabs(parseInt(value))
    })
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

  setTabs(value) {
    if (value === 0){
      this.home();
    }else {
      try {
        this.newstabs.select(value);
      }catch (err){
        // console.log(err);
      }
    }
  }

}
