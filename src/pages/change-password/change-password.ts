import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  oldPass: string = '';
  newPass: string = '';
  confirmPass: string = '';
  userData:any = {};
  language: string = 'ar';

  constructor(public navCtrl: NavController,
              public viewCtrl :ViewController,
              public util: UtilProvider,
              public user: User,
              public storage:Storage,
              public navParams: NavParams) {
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
    this.storage.get('userData').then(data=>{
      this.userData = JSON.parse(data);
      console.log('ChangePasswordPage this.userData ----',this.userData);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  back() {
    this.viewCtrl.dismiss();
  }

  changePassWord() {
    if (this.oldPass.trim() === ''){
      this.util.presentToast('Please Enter Your Old Password')
      return;
    }
    if (this.newPass.trim() === ''){
      this.util.presentToast('Please Enter New Password')
      return;
    }
    if (this.confirmPass.trim() === ''){
      this.util.presentToast('Please Enter Confirm Password')
      return;
    }
    if (this.newPass.trim() !== this.confirmPass.trim()){
      this.util.presentToast('New Password and Confirm Password Should Match')
      return;
    }

    this.util.presentLoading();
    let formData = new FormData();
    formData.append('ID',this.userData.ID);
    formData.append('old_pass',this.oldPass);
    formData.append('user_pass',this.newPass);

    this.user.changePassword(formData).subscribe((resp) => {
      let response :any= resp;
      this.util.dismissLoading();
      this.util.presentToast(response.message);
      if(response.status){
        this.viewCtrl.dismiss();
      }

    }, (err) => {
      console.error('ERROR :', err);
      this.util.dismissLoading();
      this.util.presentToast(err.error.message);
    });
  }
}
