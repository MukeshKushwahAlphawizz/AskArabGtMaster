import { Component } from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
import {TranslateService} from "@ngx-translate/core";
import {SocialSharing} from "@ionic-native/social-sharing";
import {animate, state, style, transition, trigger} from "@angular/animations";

@IonicPage()
@Component({
  selector: 'page-question-detail',
  templateUrl: 'question-detail.html',
  animations: [
    trigger('slideIn', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [
        style({ height: '*' }),
        animate(300, style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: '0' }),
        animate(300, style({ height: '*' }))
      ])
    ])
  ]
})
export class QuestionDetailPage {
  isVideoNeeded: boolean = false;
  userData :any = '';
  questionData : any = [];
  videoTypeList:any = [{name:''},{name:'YouTube'},{name:'Vimeo'},{name:'Dailymotion'},{name:'Facebook'}];
  vedioType: any = '';
  videoLink: any = '';
  answer: string = '';
  replyText: any = '';
  imageData: string = '';
  imageName: string = '';
  Add_Attachment: string = '';
  Add_To_Favorite: string = '';
  Added_As_Favorite: string = '';
  Follow: string = '';
  Followed: string = '';

  addToFavText: string = '';
  followText: string = '';
  commonTexts : any = {};
  dark: string = '';
  language: string = '';

  constructor(public navCtrl: NavController,
              public util: UtilProvider,
              public user : User,
              public storage : Storage,
              public socialSharing: SocialSharing,
              public translateService : TranslateService,
              public actionSheetCtrl : ActionSheetController,
              public navParams: NavParams) {
    // console.log('data from nav params ===',navParams.data);
    this.dark = user.getTheme();
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
    translateService.get("Common").subscribe(values => {
      this.commonTexts = values;
      this.videoTypeList[0].name = values.Select_Video_Type;
    })
    translateService.get("Question").subscribe(values => {
      this.imageName = this.Add_Attachment = values.Add_Attachment;
      this.addToFavText = this.Add_To_Favorite = values.Add_To_Favorite;
      this.Added_As_Favorite = values.Added_As_Favorite;
      this.followText = this.Follow = values.Follow;
      this.Followed = values.Followed;
    });
    navParams.data.question? this.questionData = navParams.data.question : this.questionData = [];
    this.storage.get('userData').then(data => {
      this.userData = JSON.parse(data);
      this.addView();
    })
    if(this.questionData.follow_question_status && this.questionData.follow_question_status === 'true'){
      this.followText = this.Followed;
    }
    if(this.questionData.favorite_question_status && this.questionData.favorite_question_status === 'true'){
      this.addToFavText = this.Added_As_Favorite;
    }
  }

  playSound(){
    setTimeout(()=>{
      let sound:any = document.getElementById("audio");
      sound.play();
    },300)
  }

  ionViewDidLoad() {
  }

  addView() {
    let data = {
      question_id:this.questionData.ID,
      user_id:this.userData.ID
    };
    this.user.addView(data).subscribe((resp) => {
    }, (err) => {
      console.error('ERROR :', err);
    });
  }

  openMyProfile(isOtherUser,userId) {
    this.navCtrl.push('MyProfilePage',{isOtherUserProfile : isOtherUser,userId : userId})

  }

  selectVideoType() {
    let video = document.getElementById('video');
    this.vedioType = video['options'][video['selectedIndex']].text;
    if (this.vedioType === this.videoTypeList[0].name){
      this.vedioType = '';
    }
  }

  openVideoBox() {
    this.isVideoNeeded?this.isVideoNeeded=false:this.isVideoNeeded=true;
  }

  uploadImage(data) {
    return new Promise((resolve, reject) => {
      if(data == ''){
        resolve('')
      }
      this.user.uploadImageData({upload_file:data}).subscribe((resp) => {
        let response: any = resp;
        if (response.status){
          resolve(response.message);
        }else {
          reject(response.message);
        }
      },error => {
        reject(error);
      })
    });
  }

  like(answer: any) {
    this.playSound();
    let like = 1;
    if(answer.like){
      like = 0
    }
    if(answer.likes_count == ''){
      answer.likes_count = 0;
    }

    if(answer.like){
      //doing unlike
      answer.likes_count = parseInt(answer.likes_count) - 1;
      answer.like = false;
      answer.alreadyLike = false;
      if (answer.alreadyUnlike){
        answer.unlike = true;
      }
    } else {
      // doing like
      answer.unlike = false;
      answer.likes_count = parseInt(answer.likes_count) + 1;
      answer.like = true;
      answer.alreadyLike = true;
    }
    let data = {
      like:like,
      comments_id:answer.answer_post_ID,
      from_user_id:this.userData.ID
    };
    this.user.addLikeAnswer(data).subscribe((resp) => {
      let response : any = resp;
      if(!response.status){
        answer.unlike = false;
        if(answer.likes_count == ''){
          answer.likes_count = 0;
        }
        if(answer.like){
          answer.likes_count = parseInt(answer.likes_count) - 1;
          answer.like = false;
          answer.alreadyLike = false;
        } else {
          answer.likes_count = parseInt(answer.likes_count) + 1;
          answer.like = true;
          answer.alreadyLike = true;
        }
      }
    }, (err) => {
      console.error('ERROR :', err);
    });
  }

  unlike(answer: any) {
    this.playSound();
    let unlike = 0;
    if(answer.unlike){
      unlike = 1
    }
    if(answer.likes_count == ''){
      answer.likes_count = 0;
    }
    if(answer.unlike){
      // doing like
      if(answer.alreadyLike){
        answer.like = true;
      }
      answer.likes_count = parseInt(answer.likes_count) + 1;
      answer.unlike = false;
      answer.alreadyUnlike = false;
    } else {
      // doing dislike
      answer.like = false;
      answer.likes_count = parseInt(answer.likes_count) - 1;
      answer.unlike = true;
      answer.alreadyUnlike = true;
    }
    let data = {
      like:unlike,
      comments_id:answer.answer_post_ID,
      from_user_id:this.userData.ID
    };
    this.user.addLikeAnswer(data).subscribe((resp) => {
      let response : any = resp;
      if(!response.status){
        if(answer.likes_count == ''){
          answer.likes_count = 0;
        }
        if(answer.unlike){
          if(answer.alreadyLike){
            answer.like = true;
          }
          answer.likes_count = parseInt(answer.likes_count) + 1;
          answer.unlike = false
        } else {
          answer.like = false;
          answer.likes_count = parseInt(answer.likes_count) - 1;
          answer.unlike = true;
        }
      }
    }, (err) => {
      console.error('ERROR :', err);
    });
  }

  addAnswer() {
    if (this.answer.trim() === ''){
      if(this.imageData === ''){
        return;
      }else {
        this.sendAnswer();
      }
    }else {
      this.sendAnswer();
    }
  }

  sendAnswer(){
    this.util.presentLoading();
    this.uploadImage(this.imageData).then(url=>{
      let data = {
        user_id:this.userData.ID,
        answer_content:this.answer,
        question_id:this.questionData.ID,
        video_answer_type:this.vedioType,
        video_answer_id:this.videoLink,
        upload_file:url
      };
      this.user.addAnswer(data).subscribe((resp) => {
        this.util.dismissLoading();
        let response : any = resp;
        if(response.status){
          let pushData : any = {
            "comment_user_id":response.data[0].comment_user_id,
            "answer_user_rank":response.data[0].answer_user_rank,
            "answer_image_link":response.data[0].answer_image_link,
            "answer_post_ID":response.data[0].answer_post_ID,
            "answer_author":response.data[0].answer_author,
            "answer_date_gmt":response.data[0].answer_date_gmt,
            "answer_content":response.data[0].answer_content,
            "user_profile":response.data[0].user_profile,
            "getvideo_answer_type":response.data[0].getvideo_answer_type,
            "getvideo_answer_id":response.data[0].getvideo_answer_id,
            "getattachment":response.data[0].getattachment,
            "likes_count":response.data[0].likes_count,
            "reply":[],
          };
          this.answer = '';
          this.videoLink = '';
          this.imageData = '';
          this.imageName = this.Add_Attachment;
          this.questionData.answer_data.push(pushData);

          this.util.presentToast(this.commonTexts.Answer_Added_Successfully);
        }
      }, (err) => {
        console.error('ERROR :', err);
        this.util.dismissLoading();
      });
    }).catch(err=>{
      this.util.dismissLoading();
    })
  }

  reply(answer){
    if(answer.isReplyView){
      answer.isReplyView = false;
      this.questionData.isViewAll = true;
    }else {
      this.questionData.isViewAll = false;
      answer.isReplyView=true;
    }
  }

  sendReply(answer: any) {
    if (this.replyText.trim() === ''){
      return;
    }
    let data = {
      answer_id:answer.answer_post_ID,
      user_id:this.userData.ID,
      reply_content:this.replyText,
      question_id:this.questionData.ID
    }
    this.util.presentLoading();
    this.user.addReply(data).subscribe((resp) => {
      this.util.dismissLoading();
      let response : any = resp;
      if(response.status){
        answer.isReplyView = false;
        answer.isReplyDone = true;
        this.questionData.isViewAll = false;
        this.replyText = '';
        let pushData : any = {
          "reply_post_ID":response.data[0].reply_post_ID,
          "reply_author":response.data[0].reply_author,
          "reply_date_gmt":response.data[0].reply_date_gmt,
          "reply_content":response.data[0].reply_content,
          "user_profile":response.data[0].user_profile
        }
        answer.reply.splice(0,0,pushData);
      }
    }, (err) => {
      console.error('ERROR :', err);
      this.util.dismissLoading();
    });
  }

  addAttachment() {
    this.selectOptionForAttachment();
  }

  selectOptionForAttachment() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.commonTexts.Choose_take_picture,
      buttons: [
        {
          text: this.commonTexts.Take_picture,
          handler: () => {
            this.util.takePicture().then(data =>{
              this.imageData =  'data:image/png;base64,'+data.imageData;
              this.imageName = this.util.randomImg();
            });
          }
        },
        {
          text: this.commonTexts.Choose_picture,
          handler: () => {
            this.util.aceesGallery().then(data =>{
              this.imageData =  'data:image/png;base64,'+data.imageData;
              this.imageName = this.util.randomImg();
            });
          }
        }
      ]
    });
    actionSheet.present();
  }

  deleteReply(id,array,index) {
    this.util.presentConfirm(this.commonTexts.Delete_Reply,this.commonTexts.Are_you_sure_delete).then(()=>{
      let data = {answer_id:id};
      this.util.presentLoading();
      this.user.delete(data).subscribe(response =>{
        array.splice(index,1);
        this.util.dismissLoading();
      },err=>{
        console.log('error >>',err);
        this.util.dismissLoading();
      })
    }).catch(()=>{
      console.log('Cancelled!');
    })
  }

  editReply(reply) {
    this.util.showInputAlert(reply.reply_author,'Edit Your Reply','Write Here',reply.reply_content).then(data=>{
      console.log(data);
      if (data == ''){
        this.util.presentToast('Please Enter the Reply');
        return;
      }
        let sendData = {reply_id:reply.reply_post_ID,reply_content:data};
        this.util.presentLoading();
        this.user.editReply(sendData).subscribe(response =>{
          let res : any = response;
          if (res.status){
            reply.reply_content = data;
          }
          this.util.dismissLoading();
        },err=>{
          this.util.dismissLoading();
        })
        }).catch(err=>{
          console.log(err);
        })
  }

  addToFavorite() {
    let data = {question_id:this.questionData.ID, user_id :this.userData.ID};
    this.util.presentLoading();
    if (this.addToFavText == this.Add_To_Favorite){
      this.user.addTofavoriteQuestion(data).subscribe(response =>{
        this.util.dismissLoading();
        this.addToFavText = this.Added_As_Favorite;
      },err=>{
        console.log('error >>',err);
        this.util.dismissLoading();
      })
    }else {
      this.user.removeFavouriteQuestion(data).subscribe(response =>{
        this.util.dismissLoading();
        this.addToFavText = this.Add_To_Favorite;
      },err=>{
        console.log('error >>',err);
        this.util.dismissLoading();
      })
    }
  }

  follow() {
    let data = {question_id:this.questionData.ID, user_id :this.userData.ID};
    this.util.presentLoading();
    if (this.followText == this.Follow){
      this.user.followQuestion(data).subscribe(response =>{
        this.util.dismissLoading();
        this.followText = this.Followed;
      },err=>{
        console.log('error >>',err);
        this.util.dismissLoading();
      })
    }else {
      this.user.unFollowQuestion(data).subscribe(response =>{
        this.util.dismissLoading();
        this.followText = this.Follow;
      },err=>{
        console.log('error >>',err);
        this.util.dismissLoading();
      })
    }
  }

  report(data: any,type) {
    console.log(data);
    this.navCtrl.push('ReportPage',{item:data,type:type});
  }

  shareQuestion() {
     this.socialSharing.share('Ask Arab GT: '+'\n Question :'+this.questionData.post_title+'\n Details :'+ this.questionData.post_content+'\n ','', [],'askarabgt://app.arabgt.com/questionDetail?id='+this.questionData.ID).then((succ) => {
      // Success!
      console.log('shared !!',succ);
    }).catch((err) => {
      // Error!
      console.log('error !!',err);
    });
  }

  selectPoll(option) {
    // console.log('select the radio >>>',option);
    if (this.userData){
      let sendData = {user_id:this.userData.ID,post_id:this.questionData.ID,poll_option:option};
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
    }
  }
}
