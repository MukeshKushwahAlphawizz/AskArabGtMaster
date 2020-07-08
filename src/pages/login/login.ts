import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';

import { User } from '../../providers';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import {HttpClient} from "@angular/common/http";
import {UtilProvider} from "../../providers/util/util";
import {FCM} from "@ionic-native/fcm";
import { GooglePlus } from '@ionic-native/google-plus';
import {Storage} from "@ionic/storage";
import {TranslateService} from "@ngx-translate/core";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginForm: FormGroup;
  error_messages : any = {};
  private firebaseToken: string = '';
  isChecked: boolean = false;
  darkMode: boolean = false;
  language : string = 'ar'
  constructor(public navCtrl: NavController,
    public user: User,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public util:UtilProvider,
    private fcm: FCM,
    private fb: Facebook,
    public storage:Storage,
    private googlePlus: GooglePlus,
    public platform:Platform,
    public events:Events,
    public translateService : TranslateService,
    public httpClient: HttpClient) {
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
    this.storage.get('isNightMode').then(data=>{
      this.darkMode = data;
    })
    if (navParams.data.isNightMode){
      this.storage.set('isNightMode',navParams.data.isNightMode);
        this.user.setTheme('dark');
      this.darkMode = navParams.data.isNightMode;
    }

    this.setLanguageData();
    this.setupLoginFormData();
    if (this.platform.is('cordova')) {
      this.getFcmToken();
    }
  }
  setLanguageData(){
    this.translateService.get("CommonErrMsg").subscribe(values => {
      this.error_messages = {
        email: [
          { type: "required", message: values.EmailRequired },
          { type: "pattern", message: values.EnterValidEmail }
        ],

        password: [
          { type: "required", message: values.PasswordRequired }
        ],
      };
    })
  }
  ionViewDidLoad(){
    this.getRememberMe();
  }

  private getFcmToken() {
    this.fcm.subscribeToTopic('marketing');

    this.fcm.getToken().then(token => {
      this.firebaseToken = token;
      console.log('firebase token ===>',this.firebaseToken);
      // console.log('firebase token ========>'+ this.firebaseToken);
    });
    this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background",data);
      } else {
        console.log("Received in foreground",data);
      };
      this.events.publish('notificationRead', false);
    });
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log('onTokenRefresh called ',token);
      // this.firebaseToken = token;
    });

    this.fcm.unsubscribeFromTopic('marketing');
  }


  doLogin() {
    if (this.isChecked) {
      let remember = {
        email:this.loginForm.value.email,
        password: this.loginForm.value.password,
        isRemember:true
      }
      this.storage.set('RememberData', JSON.stringify(remember));
      this.storage.clear();
    }else {
      let remember = {
        email:'',
        password: '',
        isRemember:false
      }
      this.storage.set('RememberData', JSON.stringify(remember));
      this.storage.clear();
    }
    let formData = new FormData();
    formData.append('user_email',this.loginForm.value.email);
    formData.append('user_pass',this.loginForm.value.password);
    formData.append('Firebase_token',this.firebaseToken);
    this.util.presentLoading();
    this.user.login(formData).subscribe((resp) => {
      let response:any = resp;
      console.log(response);
      if(response.data.user_profile !== ''){
        let img = response.data.user_profile.substring(2);
        // response.data.user_profile = 'http://15.206.103.57/Arabgt/'+img;
        response.data.user_profile = 'https://alphawizz.com/Arabgt/'+img;
      }
      this.storage.set('userData', JSON.stringify(response.data));
      this.storage.set('userId', response.data.ID);
      this.storage.set('appLanguage', this.language);
      if (this.darkMode){
        this.storage.set('isNightMode',this.darkMode);
      }
      this.util.dismissLoading();
      this.navCtrl.setRoot('MenuPage')
    }, (err) => {
      this.util.dismissLoading();
      this.util.presentToast(err.error.message);
      console.error('ERROR :',err);
    });
  }
  openForgotPassord(){
    this.navCtrl.push('ForgotPasswordPage')
  }
  openSignUpPage(){
    this.navCtrl.push('SignupPage')
  }

  fbLogin() {
    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        let authResponse = res.authResponse;
        if (authResponse.accessToken) {
          this.httpClient.get(`https://graph.facebook.com/me?fields=name,email,picture.width(400).height(400)&access_token=${authResponse.accessToken}`).subscribe(
            data=> {
              let fbResponse:any = data;
              this.callSocialRegisterApi(fbResponse.name,fbResponse.email,fbResponse.picture.data.url?fbResponse.picture.data.url:'',2);
            },error => {
              console.log(error);
            }
          );
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  googleLogin(){
    this.googlePlus.login({})
      .then(res => {
        console.log('response ====>', res);
        let googleData : any = res;
        this.callSocialRegisterApi(googleData.givenName,googleData.email,googleData.imageUrl?googleData.imageUrl:'',3);
      })
      .catch(err => console.error(err));
  }

  callSocialRegisterApi(name: any, email:any, imageUrl: any, status:number) {
    this.util.presentLoading();
    let socialData = {
      user_login:name,
      user_email:email,
      user_profile:imageUrl,
      status:status,
      Firebase_token:this.firebaseToken
    }
    this.user.socialLoginApi(socialData).subscribe((resp) => {
      let response : any = resp;
      this.storage.set('userData', JSON.stringify(response.data));
      this.storage.set('userId', response.data.ID);
      this.storage.set('appLanguage', this.language);
      if (this.darkMode){
        this.storage.set('isNightMode',this.darkMode);
      }
      this.util.dismissLoading();
      // this.navCtrl.setRoot('MenuPage')
      this.navCtrl.setRoot('EditProfilePage',{fromSignUp:true});
    }, (err) => {
      console.error('ERROR :',err);
      this.util.dismissLoading();
    });
  }

  setupLoginFormData() {
    this.loginForm = this.formBuilder.group(
      {
        email: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
          ])
        ),
        password: new FormControl(
          "",
          Validators.compose([
            Validators.required,
          ])
        ),
      },
    );
  }
  rememberMe() {
    this.isChecked = !this.isChecked;
    if (this.isChecked) {
      let remember = {
        email:this.loginForm.value.email,
        password: this.loginForm.value.password,
        isRemember:true
      }
      this.storage.set('RememberData', JSON.stringify(remember));
      this.storage.clear();
    }else {
      let remember = {
        email:'',
        password: '',
        isRemember:false
      }
      this.storage.set('RememberData', JSON.stringify(remember));
      this.storage.clear();
    }
  }
  getRememberMe() {
    this.storage.get('RememberData').then(data => {
      let rememberData:any = JSON.parse(data);
      if(rememberData){
        this.loginForm.controls.email.setValue(rememberData.email);
        this.loginForm.controls.password.setValue(rememberData.password);
        this.isChecked = rememberData.isRemember;
      }
    })
  }
}
