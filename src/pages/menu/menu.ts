import { Component, ViewChild } from '@angular/core';
import {
  App,
  Events,
  IonicPage,
  MenuController,
  Nav,
  NavController,
  Platform,
  ToastController
} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {CATEGORY_ID, UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import { SocialSharing } from '@ionic-native/social-sharing';
import {animate, state, style, transition, trigger} from "@angular/animations";


interface PageItem {
  title:string,
  pageName:string,
  index:any
}
type PageList = PageItem[]

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
  animations: [
    trigger('slideIn', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [
        style({ height: '*' }),
        animate(300, style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: '0' }),
        animate(300, style({ height: '*' }))
      ])
    ])
  ]
})
export class MenuPage {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = '';
  pages: PageList;
  userImage: any = 'assets/img/profile-default.jpeg';
  fullName: any = 'User Full Name';
  isCategory: any = 0;
  language : string = 'ar';
  dark: any = '';
  private allowClose: Boolean;
  private lastBack: number;

  constructor(public navCtrl: NavController,
              public storage : Storage,
              public util: UtilProvider,
              public user : User,
              public platform : Platform,
              public events : Events,
              public app : App,
              public toastCtrl : ToastController,
              public socialSharing: SocialSharing,
              public menuCtrl : MenuController) {
    this.dark = user.getTheme();
    storage.get('isNightMode').then(data=>{
      if (data) {
        user.setTheme('dark');
        this.dark = 'dark';
      }
    })

    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
    events.subscribe('appLanguage', (value) => {
      this.language = value;
    });
    events.subscribe('setDarkTheme', (value) => {
      this.dark = value;
    });
    this.platform.registerBackButtonAction(() => {
      const overlay = this.app._appRoot._overlayPortal.getActive();
      let nav : any = this.app.getActiveNav();
      const closeDelay = 2000;
      const spamDelay = 500;

      if(overlay && overlay.dismiss) {
        overlay.dismiss();
      } else if(nav.canGoBack()){
        nav.pop();
      } else if(Date.now() - this.lastBack > spamDelay && !this.allowClose) {
        // console.log('=================== nav ===================',nav.root);
        if(nav.root == 'HomePage'){
          this.events.publish('refreshFeed', false);
        }
        this.allowClose = true;
        let toast = this.toastCtrl.create({
          message: 'Press again the back button to exit the app',
          duration: closeDelay,
          dismissOnPageChange: true
        });
        toast.onDidDismiss(() => {
          this.allowClose = false;
        });
        toast.present();
      } else if(Date.now() - this.lastBack < closeDelay && this.allowClose) {
        this.platform.exitApp();
      }
      this.lastBack = Date.now();
    });
  }

  ionViewWillEnter() {
    this.storage.get('userData').then(data=>{
      let userData = JSON.parse(data);
      if(userData && userData.user_profile && userData.user_profile !== '' && userData.user_profile !== 'http://ask.arabgt.com/wp-content/uploads/'){
        this.userImage=userData.user_profile;
      }
      if(userData.first_name ==='' || userData.last_name ===''){
        if(userData && userData.user_login){
          this.fullName = userData.user_login;
        }
      }else {
        this.fullName = userData.first_name +' '+ userData.last_name;
      }
    })
  }
  ionViewDidLoad() {
    //Open Default Home Page
    setTimeout(()=>{
      this.openPage({ title: 'Home', pageName: 'TabsPage', index: 1 }, false,0)
    },10);
    setTimeout(()=>{
      this.loadNotifications();
    },5000);
  }

  editProfile(){
    this.menuCtrl.toggle();
    this.nav.setRoot('EditProfilePage');
  }

  openMyProfile(isOtherUser) {
    this.menuCtrl.toggle();
    this.navCtrl.push('MyProfilePage',{isOtherUserProfile : isOtherUser})
  }

  openPage(page, isToggle, catId) {
    CATEGORY_ID.value = catId;
    let params = {};
    if (isToggle){
      this.menuCtrl.toggle();
    }
    if (page.index) {
      params = { tabIndex: page.index };
    }
    if (this.nav.getActiveChildNav() && page.index != undefined) {
      if(page.index == 1){
        this.nav.setRoot(page.pageName, params);
      }else{
        this.nav.getActiveChildNav().select(page.index);
      }
    } else {
      this.nav.setRoot(page.pageName, params);
    }
  }

  logout() {
    this.menuCtrl.toggle();
    this.storage.get('userId').then(userId=>{
      let data = {user_id:userId};
      this.util.presentLoading();
      this.user.logoutUser(data).subscribe(response =>{
        this.storage.set('userData',null);
        this.storage.set('userId', null);
        this.storage.set('selectedCategories', null);
        this.storage.get('isNightMode').then(data=>{
          this.navCtrl.setRoot('LoginPage',{isNightMode:data});
          this.util.dismissLoading();
        })
      },err=>{
        console.log('error >>',err);
        this.util.dismissLoading();
      })
    });
  }

  openShareDialog() {
    this.menuCtrl.toggle();
    let message = 'Join Us and Download Arabgt App Now from ( Link ) ';
    if (this.language == 'ar'){
      message = 'انضم لعائلة عرب جي تي عبر تحميل تطبيقنا من هنا'
    }
    this.socialSharing.share(message, 'ArabGT', []).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

  openSocial(url) {
    this.menuCtrl.toggle();
    window.open(url);
  }

  private loadArticles() {
    let formData : any = new FormData();
    formData.append('pageSize',10);
    formData.append('pageNumber',0);
    this.user.getArticalsList(formData).subscribe((resp) => {
      let response: any = resp;
      this.user.setArticles(JSON.stringify(response));
    });
  }

  loadNotifications(){
    this.storage.get('userId').then(userId=>{
      let data = {user_id:userId, pageSize : 10, pageNumber: 0};
      this.user.getnotificationcontentData(data).subscribe(response => {
        let res: any = response;
        this.user.setNotifications(JSON.stringify(res.data));
      })
    })
  }

  openNewsArticle() {
    this.navCtrl.setRoot('NewsTabsPage');
  }

  openMenu() {
    this.ionViewWillEnter();
  }
}
