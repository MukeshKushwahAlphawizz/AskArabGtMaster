import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {User} from "../../providers";
import {Events, Nav} from "ionic-angular/index";

@IonicPage()
@Component({
  selector: 'page-news-menu',
  templateUrl: 'news-menu.html',
})
export class NewsMenuPage {
  @ViewChild(Nav) nav: Nav;
  dark: any = '';
  rootPage: any = '';
  type : number = 0;
  constructor(public navCtrl: NavController,
              public storage : Storage,
              public user : User,
              public events : Events,
              public navParams: NavParams) {
    this.dark = user.getTheme();
    storage.get('isNightMode').then(data=>{
      if (data) {
        user.setTheme('dark');
        this.dark = 'dark';
      }
    })
    events.subscribe('setDarkTheme', (value) => {
      this.dark = value;
    });
    events.subscribe('backToHome', (value) => {
      this.back(value);
    });
    this.setPage();
  }

  ionViewDidLoad() {
  }

  setPage() {
    this.type = this.navParams.data.type;
    if (this.type === 3){
      setTimeout(()=>{
        this.nav.setRoot('NewsDetailPage',{postId:this.navParams.data.postId,banner:this.navParams.data.banner});
      },100)
    }else if (this.type === 2){
      setTimeout(()=>{
        this.nav.setRoot('ArticleDetailPage',{postId:this.navParams.data.postId,banner:this.navParams.data.banner});
      },100)
    }else if (this.type === 1){
      setTimeout(()=>{
        this.nav.setRoot('VideoDetailPage',{postId:this.navParams.data.postId,banner:this.navParams.data.banner});
      },100)
    }
  }

  back(sequence) {
    this.events.publish('sequence',sequence);
    this.navCtrl.pop();
  }

  openUrl(url) {
    window.open(url);
  }
}
