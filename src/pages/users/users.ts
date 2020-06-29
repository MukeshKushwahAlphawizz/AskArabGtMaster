import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  userId:any='';
  myId:any='';
  usersList:any=[];
  type:number=0;//0 followers 1 following
  isUsersAvailable: boolean = true;
  language : string = 'en'
  constructor(public navCtrl: NavController,
              public util : UtilProvider,
              public user : User,
              public storage : Storage,
              public navParams: NavParams) {
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
    this.userId = navParams.data.userId;
    this.type = navParams.data.type;
    storage.get('userId').then(id=>{
      this.myId = id;
    })
  }

  ngOnInit(){
    this.getFollowFollowingUsers()
  }
  ionViewDidLoad() {
  }
  openMyProfile(id) {
    let isOtherUser = false;
    if(id !== this.myId){
      isOtherUser = true;
    }
    this.navCtrl.push('MyProfilePage',{isOtherUserProfile : isOtherUser,userId:id})
  }

  getFollowFollowingUsers() {
    let data = {
      user_id:this.userId
    }
    this.util.presentLoading();
    this.user.getFollowFollowingMember(data,this.type).subscribe(res=>{
      console.log(res)
      let response : any = res;
      if(response.status && response.data){
        this.usersList = response.data;
      }
      this.usersList.length?this.isUsersAvailable=true:this.isUsersAvailable=false;
      this.util.dismissLoading();
    },error => {
      console.error(error);
      this.util.dismissLoading();
    })
  }
}
