import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {TranslateService} from "@ngx-translate/core";
import { PhotoViewer } from '@ionic-native/photo-viewer';


@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {

  isOtherUserProfile:boolean = false;
  otherUserId:string = '';
  userData:any={}
  myId: any = '';
  followText: string = '';
  FOLLOW: string = '';
  FOLLOWED: string = '';
  language: string = 'en';

  constructor(public navCtrl: NavController,
              public storage : Storage,
              public util : UtilProvider,
              public user : User,
              private photoViewer: PhotoViewer,
              public translateService:TranslateService,
              public navParams: NavParams) {
    this.isOtherUserProfile = this.navParams.data.isOtherUserProfile;
    this.otherUserId = this.navParams.data.userId;
    translateService.get("MyProfile").subscribe(values => {
      this.followText = this.FOLLOW = values.FOLLOW;
      this.FOLLOWED = values.FOLLOWED;
    })
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
  }

  ionViewDidEnter() {
    if (!this.isOtherUserProfile){
      this.storage.get('userData').then(data=>{
        let userData = JSON.parse(data);
        this.getMyProfileData(userData.ID);
      })
    }else {
      this.storage.get('userId').then(id=>{
        this.myId = id;
        if(this.myId !== this.otherUserId){
          this.getOtherProfileData();
        }else {
          this.isOtherUserProfile = false;
          this.storage.get('userData').then(data=>{
            let userData = JSON.parse(data);
            this.getMyProfileData(userData.ID);
          })
        }
      })
    }
  }

  openAskQuestion() {
    if(this.userData.ID){
      this.navCtrl.push('QuestionUserPage',{myId:this.myId,userData:this.userData});
    }
  }
  getMyProfileData(id) {
    let formData = new FormData();
    formData.append('user_id',id);

    // this.util.presentLoading();
    this.user.getProfile(formData).subscribe((resp) => {
      // this.util.dismissLoading();
      let response : any = resp;
      if(response.data){
        this.userData = response.data;
      }
    }, (err) => {
      console.error('ERROR :', err);
      // this.util.dismissLoading();
    });
  }

  private getOtherProfileData() {
    let formData = new FormData();
    formData.append('user_id',this.otherUserId);
    formData.append('my_id',this.myId);

    // this.util.presentLoading();
    this.user.getOthersProfile(formData).subscribe((resp) => {
      // this.util.dismissLoading();
      let response : any = resp;
      if(response.data){
        this.userData = response.data;
        if(this.userData.follow_status && this.userData.follow_status == 'true'){
          this.followText = this.FOLLOWED;
        }
      }
    }, (err) => {
      console.error('ERROR :', err);
      // this.util.dismissLoading();
    });
  }

  followUser() {
    if(this.followText == this.FOLLOWED){
     this.callUnfollowApi();
    }else {
      this.callFollowApi();
    }
  }

  private callUnfollowApi() {
    let formData = new FormData();
    formData.append('user_id',this.myId);
    formData.append('user_id_to_unfollow',this.otherUserId);

    this.util.presentLoading();
    this.user.unFollowUser(formData).subscribe((resp) => {
      this.util.dismissLoading();
      let response : any = resp;
      if(response.status){
        this.followText = this.FOLLOW;
      }
    }, (err) => {
      console.error('ERROR :', err);
      this.util.dismissLoading();
    });
  }

  private callFollowApi() {
    let formData = new FormData();
    formData.append('user_id',this.myId);
    formData.append('user_id_to_follow',this.otherUserId);

    this.util.presentLoading();
    this.user.followUser(formData).subscribe((resp) => {
      this.util.dismissLoading();
      let response : any = resp;
      if(response.status){
        this.followText = this.FOLLOWED;
      }
    }, (err) => {
      console.error('ERROR :', err);
      this.util.dismissLoading();
    });
  }

  viewPhoto() {
    this.photoViewer.show(this.userData.user_profile !==''?this.userData.user_profile:'assets/img/profile-default.jpeg',
      (this.userData.first_name && this.userData.first_name != '' && this.userData.last_name && this.userData.last_name != '')?this.userData.first_name +' '+ this.userData.last_name : this.userData.user_login, {share: false});
  }

  gotoQAndAPage(type) {
    let id = this.userData.ID
    if (this.isOtherUserProfile){
      id = this.otherUserId;
    }
    this.navCtrl.push('QuestionAnswerPage',{type:type,userId:id,isOtherUser:this.isOtherUserProfile});
  }

  gotoUserPage(type) {
    let id = this.userData.ID
    if (this.isOtherUserProfile){
      id = this.otherUserId;
    }
    this.navCtrl.push('UsersPage',{isOtherUserProfile:this.isOtherUserProfile,userId:id,type:type});
  }

  gotoStatesDetailPage(stateType) {
    let id = this.userData.ID
    if (this.isOtherUserProfile){
      id = this.otherUserId;
    }
    this.navCtrl.push('StatesDetailPage',{isOtherUserProfile:this.isOtherUserProfile,userId:id,stateType:stateType});
  }

  editProfile() {
    this.navCtrl.push('EditProfilePage');
  }
}
