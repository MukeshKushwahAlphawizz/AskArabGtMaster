import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";
import {User} from "../../providers";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-question-answer',
  templateUrl: 'question-answer.html',
})
export class QuestionAnswerPage {
  segment = '';
  shownSessions: number = 0;
  userId:any = '';
  userData : any = {};
  questionsList:any = [];
  answersList:any = [];
  isOtherUserProfile:boolean=false;
  pageSize: number = 50;
  pageNumber: number = 0;
  commonText: any = {};
  language: string = 'ar';
  isLoading: boolean = false;

  constructor(public navCtrl: NavController,
              public util: UtilProvider,
              public storage : Storage,
              public user: User,
              public modalCtrl:ModalController,
              public translateService : TranslateService,
              public navParams: NavParams) {
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
    if (navParams.data.isOtherUser){
      this.isOtherUserProfile = navParams.data.isOtherUser;
    }
    if(navParams.data.type && navParams.data.type === 1){
      this.segment='question'
      this.shownSessions = 0;
    }else {
      this.segment='answer';
      this.shownSessions = 1;
    }
    storage.get('userData').then(data=>{
      let user = JSON.parse(data);
      this.userData = user;
    })
    this.translateService.get("Common").subscribe(values => {
      this.commonText=values;
    })
  }

  ionViewDidLoad() {
    this.storage.get('userId').then(data=>{
      this.userId = data;
      this.getQuestionAnswers(false);
    })
  }

  updateSchedule() {
    this.shownSessions>0?this.shownSessions=0:this.shownSessions=1;
  }

  openMyProfile(isOtherUser: boolean,userID) {
    this.navCtrl.push('MyProfilePage',{isOtherUserProfile : isOtherUser,userId:userID})
  }

  gotoQuestionDetail(question) {
    console.log('question is >>>>>>>>',question);
    if (question.poll[0] && question.poll[0].title === '' && question.poll[0] && question.poll[0].value === ''){
      question.poll = [];
    }
    let modal = this.modalCtrl.create('QuestionAnswerDetailPage',{question:question,isOtherUser:this.isOtherUserProfile});
    modal.onDidDismiss(data => {
      if (data && data.reload){
        this.getQuestionAnswers(data.reload);
      }
    });
    modal.present();
  }

  getQuestionAnswers(isReload){
    if (this.navParams.data.userId){
      this.userId = this.navParams.data.userId;
    }
    let data = {
      pageSize:this.pageSize,
      pageNumber:this.pageNumber,
      user_id:this.userId
    };
    if(isReload){
      this.pageNumber = 0;
      data = {
        pageSize:this.pageSize,
        pageNumber:this.pageNumber,
        user_id:this.userId
      };
    }
    // this.util.presentLoading();
    this.isLoading = true;
    this.user.getMyQuestionAnswerData(data).subscribe((resp) => {
      // this.util.dismissLoading();
      this.isLoading = false;
      let response : any = resp;
      if(response.status){
        if (response.data_question){
          this.questionsList = response.data_question;
        }
        if (response.data_answer){
          this.answersList = response.data_answer;
        }
      }
      if(!response.status && isReload){
        this.questionsList = [];
        this.answersList = [];
      }
    }, (err) => {
      console.error('ERROR :', err);
      // this.util.dismissLoading();
      this.isLoading = false;
    });
  }

  deleteAnswer(answer,index) {
    this.util.presentConfirm(this.commonText.ConfirmDelete,this.commonText.Are_you_sure_delete).then(()=>{
      let data = {answer_id:answer.answer};
      this.util.presentLoading();
      this.user.delete(data).subscribe(res =>{
        this.util.dismissLoading();
        let response :any= res;
        if(response.status){
          this.answersList.splice(index,1);
        }
      },err=>{
        this.util.dismissLoading();
      })
    }).catch(()=>{
    })
  }

  editAnswer(answer) {
    this.util.showInputAlert(answer.answer_user_name,'Edit Your Answer','Answer',answer.comment_content).then(data=>{
      console.log(data);
      if (data == ''){
        this.util.presentToast('Please Enter the Answer');
        return;
      }
      let sendData = {
        answer_id:answer.answer,
        answer_content:data,
        video_answer_type:'',
        video_answer_id:'',
        upload_file:''
      };
      this.util.presentLoading();
      this.user.editAnswer(sendData).subscribe(response =>{
        let res : any = response;
        if (res.status){
          answer.comment_content = data;
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
    // console.log(item);
    this.getQuestionData(item.post_id)
  }
  getQuestionData(questionId){
    this.util.presentLoading();
    let data = {question_id:questionId,user_id:this.userData.ID};
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
}
