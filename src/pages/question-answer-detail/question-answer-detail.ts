import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the QuestionAnswerDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-question-answer-detail',
  templateUrl: 'question-answer-detail.html',
})
export class QuestionAnswerDetailPage {

  questionData:any = '';
  dark : any = '';
  isOtherUserProfile:boolean=false;
  commonText: any = {};
  language: string = 'ar';
  constructor(public navCtrl: NavController,
              public util: UtilProvider,
              public user: User,
              public storage: Storage,
              public events : Events,
              public translateService : TranslateService,
              public navParams: NavParams, public viewCtrl: ViewController) {
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
    if (navParams.data.isOtherUser){
      this.isOtherUserProfile = navParams.data.isOtherUser;
    }
    this.dark = user.getTheme();
    this.questionData = navParams.data.question;
    this.translateService.get("Common").subscribe(values => {
      this.commonText=values;
    })
  }

  ionViewDidLoad() {
  }

  /*openMyProfile(isOtherUser: boolean) {
    this.navCtrl.push('MyProfilePage',{isOtherUserProfile : isOtherUser})
  }*/

  done() {
    this.viewCtrl.dismiss();
  }

  deleteQuestion() {
    this.util.presentConfirm(this.commonText.ConfirmDelete,this.commonText.Are_you_sure_delete).then(()=>{
      this.util.presentLoading();
      let data = {question_id:this.questionData.ID};
      this.user.deleteQuestionData(data).subscribe((resp) => {
        let response :any= resp;
        this.util.dismissLoading();
        this.util.presentToast(this.commonText.QuestionDeletedSuccessfully);
        if(response.status){
          // this.events.publish('refreshFeed', true);
          this.viewCtrl.dismiss({reload:true});
        }
      }, (err) => {
        console.error('ERROR :', err);
        this.util.dismissLoading();
        this.util.presentToast(err.error.message);
      });
    }).catch(err=>{

    })
  }

  back() {
    this.viewCtrl.dismiss();
  }

  editQuestion() {
    this.util.showInputAlertWithMultipleInput(this.questionData.user_login,'Edit Your Question',
      'Question',this.questionData.post_title,this.questionData.post_content,'Description').then(data=>{
      if (data['title'] == ''){
        this.util.presentToast('Please Enter the Question');
        return;
      }
      let sendData = {question_id:this.questionData.ID,post_title:data['title'],post_content:data['subtitle']};
      this.util.presentLoading();
      this.user.editQuestionData(sendData).subscribe(response =>{
        let res : any = response;
        if (res.status){
          this.questionData.post_title = data['title'];
          this.questionData.post_content = data['subtitle'];
        }
        this.util.dismissLoading();
      },err=>{
        this.util.dismissLoading();
      })
    }).catch(err=>{
      console.log(err);
    })
  }

  gotoDetailPage(item: any) {
    this.getQuestionData(item.ID,item.post_author)
  }
  getQuestionData(questionId,userID){
    this.util.presentLoading();
    let data = {question_id:questionId,user_id:userID};
    this.user.getQuestionByIdData(data).subscribe(res =>{
      let response : any = res;
      if (response.status){
        if (response.data[0].poll[0] && response.data[0].poll[0].title === '' && response.data[0].poll[0] && response.data[0].poll[0].value === ''){
          response.data[0].poll = [];
        }
        this.navCtrl.push('QuestionDetailPage',{question:response.data[0]})
      }
      this.util.dismissLoading();
    },err=>{
      console.error(err);
    })
  }

  selectPoll(option) {
    this.storage.get('userId').then(userId=>{
      let sendData = {user_id:userId,post_id:this.questionData.ID,poll_option:option};
      this.util.presentLoading();
      this.user.addPollAnswerData(sendData).subscribe(response =>{
        let res : any = response;
        // console.log('addPollAnswerData',res);
        if (res.status){
          this.questionData.poll_progress = res.poll_progress;
          this.questionData.poll_vote_status = 'true';
        }
        this.util.dismissLoading();
      },err=>{
        this.util.dismissLoading();
      })
    })

  }
}
