import {Component, ViewChild} from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import {Config, Events, Nav, NavController, Platform} from 'ionic-angular';

import {User} from '../providers';
import {Storage} from "@ionic/storage";
import {Deeplinks} from "@ionic-native/deeplinks";
import {UtilProvider} from "../providers/util/util";

@Component({
  template: `<ion-nav [ngClass]="dark" #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = '';
  dark: any = '';
  @ViewChild(Nav) navChild:Nav;
  // rootPage = 'QuestionAnswerPage';

  constructor(private translate: TranslateService,
              public storage:Storage,
              public platform: Platform,
              public user : User,
              private deeplinks: Deeplinks,
              private util: UtilProvider,
              public events : Events, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    platform.ready().then(() => {
     this.statusBar.styleLightContent();
       setTimeout(()=>{
         this.splashScreen.hide();
       },800)

      // deeplinking of shared question
      this.deeplinks.routeWithNavController(this.navChild, {
        '/questionDetail/:id': 'QuestionDetailPage'
      }).subscribe(match => {
        let matchData : any = match;
        let question_id = matchData.$link.queryString.substring(2, matchData.$link.queryString.length);
        this.getQuestionData(question_id);

      }, nomatch => {
        console.error('Got a deeplink that didn\'t match', nomatch);
      });

      storage.get('isNightMode').then(data=>{
        if(data){
          this.user.setTheme('dark');
          this.dark = 'dark'
        }else {
          this.user.setTheme('');
          this.dark = ''
        }
      })
      storage.get('userData').then(data=>{
        if(data){
          this.rootPage = 'MenuPage';
        }else {
          this.rootPage = 'LoginPage'
        }
      });

    });

    events.subscribe('setDarkTheme', (value) => {
      this.dark = value;
    });
    this.storage.get('appLanguage').then(data=>{
      if(data && data == 'en'){
        this.storage.set('appLanguage','en').then(()=>{
          this.events.publish('appLanguage', 'en');
        });
      }else {
        this.storage.set('appLanguage','ar').then(()=>{
          this.events.publish('appLanguage', 'ar');
        });
      }
    });

    events.subscribe('appLanguage', (value) => {
      this.initTranslate();
    });
  }

  getQuestionData(questionId){
    this.util.presentLoading();
    let data = {question_id:questionId};
    this.user.getQuestionByIdData(data).subscribe(res =>{
      let response : any = res;
      if (response.status){
        console.log(response.data[0]);
        this.navChild.push('QuestionDetailPage',{question:response.data[0]})
      }else {
        this.util.presentToast('Question Not Exist');
      }
      this.util.dismissLoading();
    },err=>{
      console.error(err);
    })
  }

  initTranslate() {
    this.storage.get('appLanguage').then(data=>{
      if(data && data == 'en'){
        this.translate.setDefaultLang('en');
        this.translate.use('en');
      }else {
        this.translate.setDefaultLang('ar');
        this.translate.use('ar');
      }
      this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
        this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
      });
    });
  }

}
