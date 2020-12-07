import { Component } from '@angular/core';
import {ActionSheetController, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {User} from "../../providers";
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";
import {TranslateService} from "@ngx-translate/core";
import {trigger, style, animate, transition, state} from '@angular/animations';

@IonicPage()
@Component({
  selector: 'page-ask-question',
  templateUrl: 'ask-question.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    ),
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity:0}),
        animate(500, style({opacity:1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({opacity:0}))
      ])
    ]),
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
export class AskQuestionPage {
  imageName: string = '';
  UploadImage: string = '';
  categoryList :any = [];
  videoTypeList:any = [{name:''},{name:'youtube'},{name:'vimeo'},{name:'dailymotion'},{name:'facebook'}]
  questionInfo:any={
    post_title:"",
    post_content:"",
    is_this_question_a_poll:0,
    category_id:9,
    upload_file:"",
    'Poll[]': [],
    VedioType:"",
    Link:""
  };
  pollArray : any = [{item:''}];
  dark: any = '';
  myId: string = '';
  language: string = 'ar';
  isVideoNeeded: boolean = false;
  private commonTexts: any = {};
  private Please_write_your_question: string = '';
  private Question_Posted_Successfully: string = '';
  constructor(public navCtrl: NavController,
              public user: User,
              public actionSheetCtrl: ActionSheetController,
              public util: UtilProvider,
              public storage : Storage,
              public events : Events,
              public translateService : TranslateService,
              public navParams: NavParams) {
    storage.get('userData').then(user=>{
      let data = JSON.parse(user);
      this.myId = data.ID;
    })
    translateService.get("AskQuestion").subscribe(values => {
      this.Please_write_your_question=values.Please_write_your_question;
      this.Question_Posted_Successfully=values.Question_Posted_Successfully;
      this.imageName = this.UploadImage=values.Upload_Image;
    });
    translateService.get("Common").subscribe(values => {
      this.videoTypeList[0].name = values.Select_Video_Type;
      this.commonTexts = values;
      this.categoryList = [{
        name : values.Select_Category,
        id : 0
      },{
        name : values.General_Questions,
        id : 9
      },{
        name : values.Parts_and_Mechanics,
        id : 12
      },{
        name : values.Car_Problems,
        id : 5
      }];
    })
    this.dark = user.getTheme();
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
  }

  ionViewDidLoad() {
  }
  openPollBox(){
    this.questionInfo.is_this_question_a_poll?this.questionInfo.is_this_question_a_poll=0:this.questionInfo.is_this_question_a_poll=1;
  }

  openVideoBox() {
    this.isVideoNeeded?this.isVideoNeeded=false:this.isVideoNeeded=true;
  }
  openMyProfile(isOtherUser) {
    this.navCtrl.push('MyProfilePage',{isOtherUserProfile : isOtherUser})
  }

  selectCategory() {
    let category = document.getElementById('category');
    let val = category['options'][category['selectedIndex']].text;
    this.categoryList.filter(item => {
      if(val == item.name){
        this.questionInfo.category_id = item.id;
      }
    })
  }
  selectVideoType() {
    let video = document.getElementById('video');
    this.questionInfo.VedioType = video['options'][video['selectedIndex']].text;
    if (this.questionInfo.VedioType === this.videoTypeList[0].name){
      this.questionInfo.VedioType = '';
    }
  }

  uploadImage(data) {
    return new Promise((resolve, reject) => {
      if(data == ''){
        resolve('')
      }
      this.user.uploadImageData({upload_file:data}).subscribe((resp) => {
        let response: any = resp;
        if (response.status){
          resolve(response);
        }else {
          reject(response);
        }
      },error => {
        reject(error);
      })
    });
  }

   askQuestion() {
    if(this.questionInfo.post_title.trim() === ''){
      this.util.presentToast(this.Please_write_your_question);
      return;
    }
    this.util.presentLoading();
    this.uploadImage(this.questionInfo.upload_file).then(data=>{
      let imageData :any = data;
      this.questionInfo.upload_file = imageData.message;
      this.questionInfo['Poll[]'] = [];
      this.pollArray.filter(item =>{
        this.questionInfo['Poll[]'].push(item.item);
      })
      // console.log(this.questionInfo);
      let formData = new FormData();
      formData.append('user_id',this.myId);
      formData.append('post_title',this.questionInfo.post_title);
      formData.append('post_content',this.questionInfo.post_content);
      formData.append('is_this_question_a_poll',this.questionInfo.is_this_question_a_poll);
      formData.append('category_id',this.questionInfo.category_id);
      formData.append('upload_file',this.questionInfo.upload_file);
      formData.append('Poll[]',this.questionInfo['Poll[]']);
      formData.append('VedioType',this.questionInfo.VedioType);
      formData.append('Link',this.questionInfo.Link);
      formData.append('imagename',imageData.imagename?imageData.imagename:'');

      this.user.addQuestion(formData).subscribe((resp) => {
        let response :any = resp;
        if (response.status){
          this.imageName = this.UploadImage;
          this.questionInfo = {
            post_title:"",
            post_content:"",
            is_this_question_a_poll:0,
            category_id:0,
            upload_file:'',
            'Poll[]': [],
            VedioType:"",
            Link:""
          };
          this.util.presentToast(this.Question_Posted_Successfully);
          // this.navCtrl.setRoot('TabsPage', { tabIndex: 0 });
          setTimeout(()=>{
            // this.events.publish('refreshFeed', true);
          },500)
        }
        this.util.dismissLoading();
      }, (err) => {
        this.util.dismissLoading();
      });
    }).catch(err=>{
      console.log('ERRROR',err);
      this.util.dismissLoading();
    })
  }

  openUploadOptions() {
      let actionSheet = this.actionSheetCtrl.create({
        title: this.commonTexts.Choose_take_picture,
        buttons: [
          {
            text: this.commonTexts.Take_picture,
            handler: () => {
              this.util.takePicture().then(data =>{
                this.questionInfo.upload_file = 'data:image/png;base64,'+data.imageData;
                this.imageName = this.util.randomImg();
              });
            }
          },
          {
            text: this.commonTexts.Choose_picture,
            handler: () => {
              this.util.aceesGallery().then(data =>{
                this.questionInfo.upload_file = 'data:image/png;base64,'+data.imageData;
                this.imageName = this.util.randomImg();
              });
            }
          }
        ]
      });
      actionSheet.present();
  }

  addMorePoll() {
    if (this.pollArray.length<5){
      this.pollArray.push({item:''});
    }
  }

  clearPoll(index: any) {
    if (this.pollArray.length ===1 && index === 0){
      this.pollArray[index] = {item:''};
      this.questionInfo['Poll[]'] = [];
      return;
    }
    this.pollArray.splice(index,1);
    this.questionInfo['Poll[]'] = [];
    this.pollArray.filter(item =>{
      this.questionInfo['Poll[]'].push(item.item);
    })
  }
}
