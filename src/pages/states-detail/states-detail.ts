import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-states-detail',
  templateUrl: 'states-detail.html',
})
export class StatesDetailPage {
  title: string = '';
  userData : any = {};
  questionsList:any = [];
  answersList:any = [];
  userId : string = ''
  stateType : string = ''
  header : string = ''
  noDataInList: boolean = false;
  isQuestion: boolean = false;
  isOtherUserProfile: boolean = false;
  isComment: boolean = false;
  commentList: any = [];
  StateDetail:any={};
  language: string = '';
  constructor(public navCtrl: NavController,
              public util : UtilProvider,
              public modalCtrl:ModalController,
              public user : User,
              public storage : Storage,
              public translateService: TranslateService,
              public navParams: NavParams) {
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
    this.title = navParams.data.title;
    this.userId = navParams.data.userId;
    this.stateType = navParams.data.stateType;
    this.isOtherUserProfile = navParams.data.isOtherUserProfile;
    translateService.get('StateDetail').subscribe(value=>{
      this.StateDetail = value;
    })
  }

  ionViewDidLoad() {
    switch (this.stateType){
      case 'Comments':
        this.isQuestion=false;
        this.isComment=true;
        this.header = this.StateDetail.Comments;
        this.getCommentsData();
        break;
      case 'Question Asked':
        this.isQuestion=true;
        this.header = this.StateDetail.QuestionAsked;
        this.getAskQuestionData();
        break;
      case 'Best Answers':
        this.header = this.StateDetail.BestAnswers;
        this.isQuestion=false;
        this.getBestAnswerData()
        break;
      case 'Favorite Question':
        this.header = this.StateDetail.FavoriteQuestion;
        this.isQuestion=true;
        this.getFavoriteQuestions();
        break;
      case 'Following Question':
        this.header = this.StateDetail.FollowingQuestion;
        this.isQuestion=true;
        this.getFollowQuestionData();
        break;
    }
  }

  gotoQuestionDetail(question: any) {
    let modal = this.modalCtrl.create('QuestionAnswerDetailPage',{question:question,isOtherUser:true});
    modal.onDidDismiss(data => {
      if (data && data.reload){
        //this.getQuestionAnswers(data.reload);
      }
    });
    modal.present();
  }

  openMyProfile(isOtherUser: boolean, post_author: any) {
    this.navCtrl.push('MyProfilePage',{isOtherUserProfile : isOtherUser,userId : post_author})
  }

  gotoDetailPage(item: any) {
    this.getQuestionData(item.post_id)
  }
  getQuestionData(questionId){
    this.util.presentLoading();
    this.storage.get('userId').then(userId=>{
      let data = {question_id:questionId,user_id:userId};
      this.user.getQuestionByIdData(data).subscribe(res =>{
        let response : any = res;
        if (response.status){
          console.log(response.data[0]);
          this.navCtrl.push('QuestionDetailPage',{question:response.data[0]})
        }
        this.util.dismissLoading();
      },err=>{
        console.error(err);
      })
    })
  }
  private getFavoriteQuestions() {
    let formData = new FormData();
    formData.append('user_id',this.userId);

    this.util.presentLoading();
    this.user.getFavoriteQuestion(formData).subscribe((resp) => {
      this.util.dismissLoading();
      let response : any = resp;
      if(response.status && response.data){
        this.questionsList = response.data;
      }
      this.questionsList.length === 0?this.noDataInList=true:this.noDataInList=false;
    }, (err) => {
      console.error('ERROR :', err);
      this.util.dismissLoading();
    });
  }

  private getAskQuestionData() {

    let formData = new FormData();
    formData.append('user_id',this.userId);

    this.util.presentLoading();
    this.user.getAskQuestion(formData).subscribe((resp) => {
      this.util.dismissLoading();
      let response : any = resp;
      if(response.status && response.data){
        // console.log('response',response);
        this.questionsList = response.data;
      }
      this.questionsList.length === 0?this.noDataInList=true:this.noDataInList=false;
    }, (err) => {
      console.error('ERROR :', err);
      this.util.dismissLoading();
    });
  }

  getFollowQuestionData() {
    let formData = new FormData();
    formData.append('user_id',this.userId);

    this.util.presentLoading();
    this.user.getFollowQuestion(formData).subscribe((resp) => {
      this.util.dismissLoading();
      let response : any = resp;
      if(response.status && response.data){
        // console.log('response',response);
        this.questionsList = response.data;
      }
      this.questionsList.length === 0?this.noDataInList=true:this.noDataInList=false;
    }, (err) => {
      console.error('ERROR :', err);
      this.util.dismissLoading();
    });
  }

  getBestAnswerData() {
    let formData = new FormData();
    formData.append('user_id',this.userId);

    this.util.presentLoading();
    this.user.getBestAnswer(formData).subscribe((resp) => {
      this.util.dismissLoading();
      let response : any = resp;
      if(response.status && response.data){
        // console.log('response',response);
        this.answersList = response.data;
      }
      this.answersList.length === 0?this.noDataInList=true:this.noDataInList=false;
    }, (err) => {
      console.error('ERROR :', err);
      this.util.dismissLoading();
    });
  }

  getCommentsData() {
    let formData = new FormData();
    formData.append('user_id',this.userId);
    this.util.presentLoading();
    this.user.getComments(formData).subscribe((resp) => {
      this.util.dismissLoading();
      let response : any = resp;
      if(response.status && response.data){
        // console.log('response',response);
        this.commentList = response.data;
      }
      this.commentList.length === 0?this.noDataInList=true:this.noDataInList=false;
    }, (err) => {
      console.error('ERROR :', err);
      this.util.dismissLoading();
    });
  }
}
