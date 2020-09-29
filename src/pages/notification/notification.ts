import {Component, ViewChild} from '@angular/core';
import {Content, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  @ViewChild(Content) content: Content;

  userId :any = '';
  notificationsList:any=[];
  isNotification: boolean = true;
  private pageNumber: number = 0;
  private pageSize: number = 10;
  private showLoadMore: boolean = true;
  public QuestionNotExist : string = '';
  language: string = 'ar';

  constructor(public navCtrl: NavController,
              public util: UtilProvider,
              public user : User,
              public events : Events,
              public translateService : TranslateService,
              public storage : Storage,
              public navParams: NavParams) {
    this.translateService.get("Notifications").subscribe(values => {
      this.QuestionNotExist = values.QuestionNotExist
    })
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  ionViewDidEnter() {
    this.scrollToTop();
    this.events.publish('notificationRead', true);
    let allNotification = this.user.getAllNotifications();
    if(allNotification){
      this.notificationsList = JSON.parse(this.user.getAllNotifications());
      this.getDataOfNotification(false);
    }else {
      this.getDataOfNotification(true);
    }

  }

  getDataOfNotification(showLoader){
    this.storage.get('userId').then(data=>{
      this.userId = data;
      this.pageNumber = 0;
      this.getAllNotifications(showLoader).then(data =>{
        let list : any = data;
        this.notificationsList = list;
        (this.notificationsList.length>0)?this.isNotification=true:this.isNotification=false;
        if (list && list.length === 10) {
          this.pageNumber = this.pageNumber+1;
          this.showLoadMore = true;
        } else {
          this.showLoadMore = false;
        }
      }).catch(()=>{
        (this.notificationsList.length>0)?this.isNotification=true:this.isNotification=false;
      });
    })
  }

  openMyProfile(b: boolean) {
    this.navCtrl.push('MyProfilePage',{isOtherUserProfile : b})
  }
  getAllNotifications(presentLoader){
    return new Promise((resolve, reject) => {
      let data = {user_id:this.userId, pageSize : this.pageSize, pageNumber: this.pageNumber};
      if(presentLoader){
        this.util.presentLoading();
      }
      this.user.getnotificationcontentData(data).subscribe(response =>{
        let res : any = response;
        if(presentLoader){
          this.util.dismissLoading();
        }
        if(res.status){
          resolve(res.data);
        }else{
          reject();
        }
      },err=>{
        this.isNotification=false;
        reject();
        if(presentLoader){
          this.util.dismissLoading();
        }
      })
    })

  }

  doRefresh(refresher) {
    this.pageNumber = 0;
    this.getAllNotifications(false).then((data)=>{
      let list : any = data
      this.notificationsList = list;
      (this.notificationsList.length>0)?this.isNotification=true:this.isNotification=false;
      if(list && list.length === 10){
        this.pageNumber = this.pageNumber+1;
        this.showLoadMore = true;
      }else {
        this.showLoadMore = false;
      }
      refresher.complete();
    }).catch(()=>{
      refresher.complete();
    }).catch(()=>{
      (this.notificationsList.length>0)?this.isNotification=true:this.isNotification=false;
    });
  }

  loadMore(infiniteScroll) {
    setTimeout(()=>{
      this.getAllNotifications(false).then((data)=>{
        let list : any = data;
        if (this.pageNumber == 0 && list){
          this.notificationsList = list;
        }else {
          this.notificationsList = [...this.notificationsList, ...list];
        }
        (this.notificationsList.length>0)?this.isNotification=true:this.isNotification=false;
        if(list && list.length === 10){
          this.pageNumber = this.pageNumber+1;
          this.showLoadMore = true;
        }else {
          this.showLoadMore = false;
        }
        infiniteScroll.complete();
      }).catch(()=>{
        (this.notificationsList.length>0)?this.isNotification=true:this.isNotification=false;
        infiniteScroll.complete();
      })
    },500)
  }

  gotoDetailPage(item) {
    // console.log(item);
    if (item.type && item.type =='user profile'){
      this.navCtrl.push('MyProfilePage',{isOtherUserProfile : true,userId : item.user_id})
    }else if (item.type && item.type =='Ask a question'){
      this.navCtrl.push('MyProfilePage',{isOtherUserProfile : false,userId : this.userId})
    }else {
      this.getQuestionData(item.question_id);
    }
  }

  getQuestionData(questionId){
    this.util.presentLoading();
    let data = {question_id:questionId,user_id:this.userId};
    this.user.getQuestionByIdData(data).subscribe(res =>{
      let response : any = res;
      if (response.status){
        // console.log(response.data[0]);
        this.navCtrl.push('QuestionDetailPage',{question:response.data[0]})
      }else {
        this.util.presentToast(this.QuestionNotExist);
      }
      this.util.dismissLoading();
    },err=>{
      console.error(err);
    })
  }
}
