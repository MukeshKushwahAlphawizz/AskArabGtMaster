import { Component } from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the SubmitAnswerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-submit-answer',
  templateUrl: 'submit-answer.html',
})
export class SubmitAnswerPage {
  imageName: string = '';
  questionData : any = {};
  answer: string = '';
  imageData: any = '';
  myID : any = '';
  commonTexts: any = {};
  language: string = 'en';
  constructor(public navCtrl: NavController,
              public util: UtilProvider,
              public user : User,
              public viewCtrl : ViewController,
              public actionSheetCtrl: ActionSheetController,
              public translateService : TranslateService,
              public storage : Storage,
              public navParams: NavParams) {
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
    this.questionData = navParams.data.question;
    this.myID = this.navParams.data.userId;
    translateService.get("Common").subscribe(values => {
      this.commonTexts = values;
    })
  }

  ionViewDidLoad() {
  }

  openMyProfile(isMine,userId) {
    this.navCtrl.push('MyProfilePage',{isOtherUserProfile : isMine,userId:userId})
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
  postAnswer() {
    if (this.answer.trim() === ''){
      return;
    }
    this.uploadImage(this.imageData).then(url=>{
      let data = {
        user_id:this.navParams.data.userId,
        answer_content:this.answer,
        question_id:this.questionData.ID,
        video_answer_type:'',
        video_answer_id:'',
        upload_file:url
      };
      this.util.presentLoading();
      this.user.addAnswer(data).subscribe((resp) => {
        this.util.dismissLoading();
        let response : any = resp;
        if(response.status){
          this.imageData = '';
          this.imageName = '';
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
          this.questionData.answer_data.push(pushData);
          this.util.presentToast(this.commonTexts.Answer_Added_Successfully);
          this.viewCtrl.dismiss();
          this.navCtrl.push('QuestionDetailPage',{question:this.questionData})

        }
      }, (err) => {
        console.error('ERROR :', err);
        this.util.dismissLoading();
      });
    }).catch(err=>{
      console.log('ERRROR',err);
      this.util.dismissLoading();
    })

  }

  openUpload() {
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
}
