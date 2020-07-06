import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the QuestionUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-question-user',
  templateUrl: 'question-user.html',
})
export class QuestionUserPage {
  profileImage: string = '';
  userName: string = '';
  questionText: string = '';
  questionDetailText: string = '';
  otherUser : any = {};
  Please_write_your_question: string = '';
  Question_Posted_Successfully: string = '';
  language: string = 'ar';

  constructor(public navCtrl: NavController,
              public util: UtilProvider,
              public user : User,
              public viewCtrl : ViewController,
              public storage : Storage,
              public translateService : TranslateService,
              public navParams: NavParams) {
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
    this.otherUser  = navParams.data.userData;
    if(this.otherUser.first_name && this.otherUser.last_name && this.otherUser.first_name !== '' && this.otherUser.last_name !== ''){
      this.userName = ' '+this.otherUser.first_name +' '+this.otherUser.last_name+' ';
    }else {
      this.userName = this.otherUser.user_login;
    }
    this.profileImage = this.otherUser.user_profile;

    translateService.get("AskQuestion").subscribe(values => {
      this.Please_write_your_question = values.Please_write_your_question;
      this.Question_Posted_Successfully = values.Question_Posted_Successfully;
    })
  }

  ionViewDidLoad() {
  }

  publishQuestion() {
    if (this.questionText === ''){
      this.util.presentToast(this.Please_write_your_question);
      return;
    }
    let data = {
      user_id:this.navParams.data.myId,
      question_from_user_id:this.otherUser.ID,
      post_title:this.questionText,
      post_content:this.questionDetailText
    }
    this.util.presentLoading();
    this.user.addQuestionsToUserData(data).subscribe((resp) => {
      this.util.dismissLoading();
      let response : any = resp;
      if(response.status){
        this.questionText = '';
        this.questionDetailText = '';
        this.util.presentToast(this.Question_Posted_Successfully);
        this.viewCtrl.dismiss();
      }
    }, (err) => {
      this.util.dismissLoading();
    });
  }
}
