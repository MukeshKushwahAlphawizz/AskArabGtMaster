import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';


@Injectable()
export class User {
  _user: any;
  loginUrl:string = 'Authentication/login/';
  register: string = 'Authentication/User_registration/';
  forgotPassword: string = 'Authentication/ForgotPassword/';
  socialLogin: string = 'Authentication/socialLogin';
  editProfile: string = 'Authentication/editProfile/';
  deleteAccount: string = 'Authentication/deleteAccount/';
  changeOldPassword: string = 'Authentication/changeOldPassword/';
  getArticals: string = 'Artical/getArticles/';
  countries: string = 'Authentication/getCountry/';
  states: string = 'Authentication/getStates/';
  questions: string = 'Question/getQuestion';
  addQuestions: string = 'Question/addquestions/';
  addLikeOnQuestions: string = 'Question/addLikeOnQuestions/';
  addLikeOnAnswer: string = 'Question/addLikeOnAnswer/';
  addAnswerOnQuestions: string = 'Question/addAnswerOnQuestions/';
  addReplyOnAnswers: string = 'Question/addReplyOnAnswers/';
  editAnswerOnQuestions: string = 'Question/editAnswerOnQuestions/';
  editReplyOnAnswers: string = 'Question/editReplyOnAnswers/';
  deleteAnswerById: string = 'Question/deleteAnswerById/';
  getMyProfile : string = 'Authentication/getMyProfile/';
  getOtherProfile : string = 'Authentication/getUsersProfile';
  addfollowing : string = 'Authentication/addfollowing/';
  removefollowing : string = 'Authentication/removefollowing/';
  addCommentOnArticle : string = 'Artical/addCommentOnArticle/';
  addReplyOnComment : string = 'Artical/addReplyOnComment/';
  getMyQuestionAnswer : string = 'Question/getMyQuestionAnswer/';
  getnotificationcontent : string = 'Question/getnotificationcontent/';
  logoutUrl : string = 'Authentication/logout/';
  addfavoritesquestions : string = 'Question/addfavoritesquestions';
  followquestions : string = 'Question/followquestions/';
  removefollowingQuestion : string = 'Question/removefollowing/';
  removefavouritequestion : string = 'Question/removefavouritequestion/';
  addviewquestions : string = 'Question/addviewquestions/';
  upload_image : string = 'Question/upload_image/';
  deleteQuestion : string = 'Question/deleteQuestion/';
  getPointsOnQuestions : string = 'Question/getPointsOnQuestions/';
  addReport : string = 'Question/addReport/';
  addQuestionsToUser : string = 'Question/addQuestionsToUser/';
  editQuestion : string = 'Question/editQuestion/';
  addContactUs : string = 'Question/addContactUs/';
  getQuestionById : string = 'Question/getQuestionById/';
  getFavoriteQuestionByUserId : string = 'Question/getFavoriteQuestionByUserId/';
  getAskQuestionByUserId : string = 'Question/getAskQuestionByUserId/';
  getFollowQuestionByUserId : string = 'Question/getFollowQuestionByUserId/';
  getFollowMemberByUserId : string = 'Question/getFollowMemberByUserId/';
  getBestAnswerByUserId : string = 'Question/getBestAnswerByUserId/';
  getCommentsByUserId : string = 'Artical/getCommentsByUserId/';
  getFollowerMemberByUserId : string = 'Question/getFollowerMemberByUserId/';
  addPollAnswer : string = 'Question/addPollAnswer/';

  theme :any = '';
  articles :any = '';
  notification :any = '';

  constructor(public api: Api) { }

  getTheme(){
    return this.theme;
  }
  setTheme(theme){
    this.theme = theme;
  }

  getAllArticles(){
    return this.articles;
  }
  setArticles(articles){
    this.articles = articles;
  }

  getAllNotifications(){
    return this.notification;
  }
  setNotifications(notification){
    this.notification = notification;
  }

  login(accountInfo: any) {
    let seq = this.api.post(this.loginUrl, accountInfo).share();
    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  signup(accountInfo: any) {
    let seq = this.api.post(this.register, accountInfo).share();
    seq.subscribe((res: any) => {
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }


  socialLoginApi(data: any) {
    let seq = this.api.post(this.socialLogin, data).share();
    return seq;
  }
  uploadImageData(data: any) {
    let seq = this.api.post(this.upload_image, data).share();
    return seq;
  }
  changePassword(data: any) {
    let seq = this.api.post(this.changeOldPassword, data).share();
    return seq;
  }
  deleteUserAccount(data: any) {
    let seq = this.api.post(this.deleteAccount, data).share();
    return seq;
  }
  forgotPasswordApi(data: any) {
    let seq = this.api.post(this.forgotPassword, data).share();
    return seq;
  }

  logout() {
    this._user = null;
  }

  _loggedIn(resp) {
    this._user = resp.user;
  }

  saveProfile(data:any) {
    let res = this.api.post(this.editProfile, data).share();
    return res;
  }

  getArticalsList(data) {
    let seq = this.api.post(this.getArticals,data,{}).share();
    return seq;
  }

  getCountryList() {
    let seq = this.api.get(this.countries,{},{}).share();
    return seq;
  }
  getStateList(data) {
    let seq = this.api.post(this.states,data,{}).share();
    return seq;
  }
  getQuestionsList(data) {
    let seq = this.api.post(this.questions,data,{}).share();
    return seq;
  }
  addQuestion(data) {
    let seq = this.api.post(this.addQuestions,data,{}).share();
    return seq;
  }
  addLikeQuestion(data) {
    let seq = this.api.post(this.addLikeOnQuestions,data,{}).share();
    return seq;
  }

  addLikeAnswer(data) {
    let seq = this.api.post(this.addLikeOnAnswer,data,{}).share();
    return seq;
  }
  addAnswer(data) {
    let seq = this.api.post(this.addAnswerOnQuestions,data,{}).share();
    return seq;
  }
  addReply(data) {
    let seq = this.api.post(this.addReplyOnAnswers,data,{}).share();
    return seq;
  }
  editAnswer(data) {
    let seq = this.api.post(this.editAnswerOnQuestions,data,{}).share();
    return seq;
  }
  editQuestionData(data) {
    let seq = this.api.post(this.editQuestion,data,{}).share();
    return seq;
  }
  editReply(data) {
    let seq = this.api.post(this.editReplyOnAnswers,data,{}).share();
    return seq;
  }
  delete(data) {
    let seq = this.api.post(this.deleteAnswerById,data,{}).share();
    return seq;
  }
  deleteQuestionData(data) {
    let seq = this.api.post(this.deleteQuestion,data,{}).share();
    return seq;
  }
  getProfile(data) {
    let seq = this.api.post(this.getMyProfile,data,{}).share();
    return seq;
  }
  getOthersProfile(data) {
    let seq = this.api.post(this.getOtherProfile,data,{}).share();
    return seq;
  }

  followUser(data) {
    let seq = this.api.post(this.addfollowing,data,{}).share();
    return seq;
  }
  unFollowUser(data) {
    let seq = this.api.post(this.removefollowing,data,{}).share();
    return seq;
  }
  addReplyOnCommentData(data) {
    let seq = this.api.post(this.addReplyOnComment,data,{}).share();
    return seq;
  }
  addCommentOnArticleData(data) {
    let seq = this.api.post(this.addCommentOnArticle,data,{}).share();
    return seq;
  }
  getMyQuestionAnswerData(data) {
    let seq = this.api.post(this.getMyQuestionAnswer,data,{}).share();
    return seq;
  }
  getnotificationcontentData(data) {
    let seq = this.api.post(this.getnotificationcontent,data,{}).share();
    return seq;
  }

  logoutUser(data) {
    let seq = this.api.post(this.logoutUrl,data,{}).share();
    return seq;
  }

  addTofavoriteQuestion(data) {
    let seq = this.api.post(this.addfavoritesquestions,data,{}).share();
    return seq;
  }
  removeFavouriteQuestion(data) {
    let seq = this.api.post(this.removefavouritequestion,data,{}).share();
    return seq;
  }
  followQuestion(data) {
    let seq = this.api.post(this.followquestions,data,{}).share();
    return seq;
  }
  unFollowQuestion(data) {
    let seq = this.api.post(this.removefollowingQuestion,data,{}).share();
    return seq;
  }
  addView(data) {
    let seq = this.api.post(this.addviewquestions,data,{}).share();
    return seq;
  }

  submitReport(data) {
    let seq = this.api.post(this.addReport,data,{}).share();
    return seq;
  }
  addQuestionsToUserData(data) {
    let seq = this.api.post(this.addQuestionsToUser,data,{}).share();
    return seq;
  }

  contactUs(data) {
    let seq = this.api.post(this.addContactUs,data,{}).share();
    return seq;
  }

  getQuestionByIdData(data) {
    let seq = this.api.post(this.getQuestionById,data,{}).share();
    return seq;
  }

  getFavoriteQuestion(data) {
    let seq = this.api.post(this.getFavoriteQuestionByUserId,data,{}).share();
    return seq;
  }
  getAskQuestion(data) {
    let seq = this.api.post(this.getAskQuestionByUserId,data,{}).share();
    return seq;
  }
  getFollowQuestion(data) {
    let seq = this.api.post(this.getFollowQuestionByUserId,data,{}).share();
    return seq;
  }
  getBestAnswer(data) {
    let seq = this.api.post(this.getBestAnswerByUserId,data,{}).share();
    return seq;
  }
  getComments(data) {
    let seq = this.api.post(this.getCommentsByUserId,data,{}).share();
    return seq;
  }

  getFollowFollowingMember(data,type) {
    if (type){
      //following users to me
      let seq = this.api.post(this.getFollowerMemberByUserId,data,{}).share();
      return seq;
    }else {
      //follower
      let seq = this.api.post(this.getFollowMemberByUserId,data,{}).share();
      return seq;
    }
  }

  addPollAnswerData(data) {
    let seq = this.api.post(this.addPollAnswer,data,{}).share();
    return seq;
  }
}
