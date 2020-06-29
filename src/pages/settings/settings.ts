import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  options: any;
  laguage: string = 'en';
  userData:any = {};
  isNightMode: boolean;
  commonText:any={};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public util: UtilProvider,
    public user: User,
    public storage:Storage,
    public events : Events,
    public translate: TranslateService) {

    this.storage.get('userData').then(data=>{
      this.userData = JSON.parse(data);
    });
    storage.get('isNightMode').then(data=>{
      this.isNightMode = data;
    })
    storage.get('appLanguage').then(data=>{
      if(data){
        this.laguage = data;
        translate.use(data);
      }else {
        this.laguage = 'en';
        translate.use('en');
      }
      translate.get("Common").subscribe(values => {
        this.commonText=values;
      });
    })
  }


  gotoEditProfile() {
    this.navCtrl.push('EditProfilePage');
  }

  selectLanguage() {
    if (this.laguage == 'en'){
      this.translate.use('en');
      this.storage.set('appLanguage','en').then(()=>{
        this.events.publish('appLanguage', 'en');
      });
    }else {
      this.translate.use('ar');
      this.storage.set('appLanguage','ar').then(()=>{
        this.events.publish('appLanguage', 'ar');
      });
    }

  }

  openMyProfile(b: boolean) {
    this.navCtrl.push('MyProfilePage',{isOtherUserProfile : b})
  }

  gotoChangePassword() {
    this.navCtrl.push('ChangePasswordPage');
  }

  deleteAccount() {
    this.util.presentConfirm(this.commonText.ConfirmDelete,this.commonText.AreyousureDeleteAccount).then(()=>{
      this.util.presentLoading();
      let formData = new FormData();
      formData.append('ID',this.userData.ID);

      this.user.deleteUserAccount(formData).subscribe((resp) => {
        let response :any= resp;
        this.util.dismissLoading();
        this.util.presentToast(response.message);
        if(response.status){
          this.navCtrl.setRoot('LoginPage');
        }
      }, (err) => {
        console.error('ERROR :', err);
        this.util.dismissLoading();
        this.util.presentToast(err.error.message);
      });
    }).catch(err=>{

    })
  }

  changeTheme(data) {
    this.storage.set('isNightMode',data.value);
    if(data.value){
      this.user.setTheme('dark');
      this.events.publish('setDarkTheme', 'dark');
    }else {
      this.user.setTheme('');
      this.events.publish('setDarkTheme', '');
    }
  }
}
