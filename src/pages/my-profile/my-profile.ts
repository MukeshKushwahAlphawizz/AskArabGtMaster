import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {TranslateService} from "@ngx-translate/core";
import { ImageViewerController } from 'ionic-img-viewer';


@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
  _imageViewerCtrl: ImageViewerController;

  isOtherUserProfile:boolean = false;
  otherUserId:string = '';
  userData:any={}
  userProfileData:any={}
  myId: any = '';
  followText: string = '';
  FOLLOW: string = '';
  FOLLOWED: string = '';
  language: string = 'ar';
  userDataStorage: any = {};

  constructor(public navCtrl: NavController,
              public storage : Storage,
              public util : UtilProvider,
              public user : User,
              public imageViewerCtrl: ImageViewerController,
              public translateService:TranslateService,
              public navParams: NavParams) {
    this._imageViewerCtrl = imageViewerCtrl;
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
        this.userDataStorage = JSON.parse(data);
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
    // console.log('this.myId',this.myId);
    if(this.myId){
      this.navCtrl.push('QuestionUserPage',{myId:this.myId,userData:this.userData});
    }
  }
  getMyProfileData(id) {
    let formData = new FormData();
    formData.append('user_id',id);
    this.user.getProfile(formData).subscribe((resp) => {
      let response : any = resp;
      if(response.data){
        this.userData = response.data;
        this.userProfileData = response.user_profile;
        this.userDataStorage.mobile_no=this.userProfileData.phone;
        this.userDataStorage.user_dob=this.userProfileData.age;
        this.userDataStorage.my_bio=this.userProfileData.description;
        this.userDataStorage.user_gender=this.userProfileData.sex;
        this.userDataStorage.select_country=this.userProfileData.country;
        this.userDataStorage.user_address=this.userProfileData.user_address;
        this.userDataStorage.user_login=this.userProfileData.user_login;
        this.userDataStorage.first_name=this.userProfileData.first_name;
        this.userDataStorage.last_name=this.userProfileData.last_name;
        this.userDataStorage.user_profile=this.userProfileData.user_profile;
        this.storage.set('userData',JSON.stringify(this.userDataStorage));
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
    this.user.getOthersProfile(formData).subscribe((resp) => {
      let response : any = resp;
      if(response.data){
        this.userData = response.data;
        this.userProfileData = response.user_profiles;
        if(this.userData.follow_status && this.userData.follow_status == 'true'){
          this.followText = this.FOLLOWED;
        }
      }
    }, (err) => {
      console.error('ERROR :', err);
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

  viewPhoto(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage);
    imageViewer.present();
    }

  gotoQAndAPage(type) {
    let id = this.userData.ID
    if (this.isOtherUserProfile){
      id = this.otherUserId;
    }
    this.navCtrl.push('QuestionAnswerPage',{type:type,userId:id,isOtherUser:this.isOtherUserProfile});
  }

  gotoUserPage(type) {
    let id = this.userDataStorage.ID
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

  getUserRegisterDate() {
    if (this.userDataStorage.user_registered){
      let arr = this.userDataStorage.user_registered.split(' ')[0];
      return arr;
    }else if (this.userData.user_registered){
      let arr = this.userData.user_registered.split(' ')[0];
      return arr;
    }else {
      return '0000-00-00';
    }
  }
}
