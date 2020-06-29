import {Component, ViewChild} from '@angular/core';
import {ActionSheetController, Content, Events, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {CATEGORY_ID, UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
import {TranslateService} from "@ngx-translate/core";
import {animate, state, style, transition, trigger} from "@angular/animations";
import { AdMobPro } from '@ionic-native/admob-pro';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity:0}),
        animate(400, style({opacity:1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(200, style({opacity:0}))
      ])
    ]),
    trigger('slideIn', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [
        style({ height: '*' }),
        animate(600, style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: '0' }),
        animate(600, style({ height: '*' }))
      ])
    ])
  ]
})
export class HomePage {
  @ViewChild(Content) content: Content;

  questionsListForSearch: any = [];
  questionsList: any = [];
  pageNumber : number = 0;
  pageSize : number = 10;
  cat_id : number = CATEGORY_ID.value;
  filter_id : number = 1;
  isQuestionAvail: boolean = true;
  margin: any = '0pt';
  userData :any = '';
  replyText: string = '';
  dark: any = '';
  Read_More: any = 'Read More';
  filterOptions: any = {};
  commonTexts : any = {};
  language : string = 'en';

  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public user:User,
              public storage:Storage,
              public admob:AdMobPro,
              public platform:Platform,
              public translateService : TranslateService,
              public events : Events,
              public actionSheetCtrl:ActionSheetController,
              public navParams: NavParams) {
    this.dark = user.getTheme();
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
    translateService.get("HOME.Read_More").subscribe(values => {
      this.Read_More=values;
    });
    translateService.get("Filter").subscribe(values => {
      this.filterOptions = values;
    });
    translateService.get("Common").subscribe(values => {
      this.commonTexts = values;
    });
    events.subscribe('refreshFeed', (value) => {
      // this.scrollToTop();
      this.pageNumber = 0;
      this.getQuestionsList(this.pageNumber,this.pageSize,this.cat_id,this.filter_id);
    });
    if (platform.is('cordova'))
    this.showAds();
  }

  ionViewDidLoad() {
    this.admob.onAdDismiss()
      .subscribe(() => { console.log('User dismissed ad'); });
  }

  showAds() {
    let adId;
    if(this.platform.is('android')) {
      adId = 'ca-app-pub-2579181101911625/3617761015';
    } else if (this.platform.is('ios')) {
      adId = 'YOUR_ADID_IOS';
    }
    var admobid :any = {};
    admobid = {
      banner: 'ca-app-pub-2579181101911625/6569844529',
      interstitial: 'ca-app-pub-2579181101911625/3617761015'
    };
    if(this.admob) this.admob.createBanner({
      adId: admobid.banner,
      position: this.admob.AD_POSITION.BOTTOM_CENTER,
      autoShow: true });

    if(this.admob) this.admob.prepareInterstitial( {adId:admobid.interstitial, autoShow:true} );

    if(this.admob) this.admob.showInterstitial();

    this.admob.prepareInterstitial({adId: adId})
      .then(() => {
        this.admob.showInterstitial();
      });
  }

  ngOnInit(){
    this.storage.get('userData').then(data => {
      this.userData = JSON.parse(data);
      this.getQuestionsList(this.pageNumber,this.pageSize,this.cat_id,this.filter_id);
    });
  }

  reply(question){
    if(question.answer_data[0].isReplyView){
      question.answer_data[0].isReplyView = false;
      question.isViewAll = true;
    }else {
      question.isViewAll = false;
      question.answer_data[0].isReplyView=true;
    }
  }

  openMyProfile(isOtherUser,userId) {
    this.navCtrl.push('MyProfilePage',{isOtherUserProfile : isOtherUser,userId : userId})
  }

  getQuestionsList(pageNum,pageSize,catId,filterId) {
    let formData = new FormData();
    formData.append('user_id',this.userData.ID);
    formData.append('pageSize',pageSize);
    formData.append('pageNumber',pageNum);
    formData.append('cat_id',catId);
    formData.append('filter_id',filterId);

    this.util.presentLoading();
    this.user.getQuestionsList(formData).subscribe((resp) => {
      // console.log('response get questions >>>',resp)
      this.util.dismissLoading();
      let response : any = resp;
      if(response.data){
        this.scrollToTop();
        this.questionsList = response.data;
        this.questionsList.filter(item=>{item.isViewAll = true});
        this.questionsListForSearch = this.questionsList;
      }
      this.questionsList.length ? this.isQuestionAvail = true : this.isQuestionAvail = false;
    }, (err) => {
      console.error('ERROR :', err);
      this.util.dismissLoading();
    });
  }

  loadMore(infiniteScroll) {
    setTimeout(()=>{
      this.pageNumber = this.pageNumber+1;
      let formData : any = new FormData();
      formData.append('user_id',this.userData.ID);
      formData.append('pageSize',this.pageSize);
      formData.append('pageNumber',this.pageNumber);
      formData.append('cat_id',this.cat_id);
      formData.append('filter_id',this.filter_id);

      this.user.getQuestionsList(formData).subscribe((resp) => {
        // console.log('response get questions >>>',resp)
        let response : any = resp;
        if(response.data){
          this.questionsList = [...this.questionsList,...response.data];
          this.questionsList.filter(item=>{item.isViewAll = true});
          this.questionsListForSearch = this.questionsList;
        }
        infiniteScroll.complete();
      }, (err) => {
        console.error('ERROR :', err);
        infiniteScroll.complete();
      });
    },500)
  }

  gotoQuestionDetail(question) {
    this.navCtrl.push('QuestionDetailPage',{question:question})
  }

  likeQuestion(question) {
    this.playSound();
    let like = 1;
    if(question.like){
      like = 0
    }
    if(question.post_likes_count == ''){
      question.post_likes_count = 0;
    }
    if(question.like){
      question.post_likes_count = parseInt(question.post_likes_count) - 1;
      question.like = false
    } else {
      question.post_likes_count = parseInt(question.post_likes_count) + 1;
      question.like = true;
    }
    let data = {
      like:like,
      post_id:question.ID,
      from_user_id:this.userData.ID
    };
    this.user.addLikeQuestion(data).subscribe((resp) => {
      let response : any = resp;
      if(!response.status){
        if(question.post_likes_count == ''){
          question.post_likes_count = 0;
        }
        if(question.like){
          question.post_likes_count = parseInt(question.post_likes_count) - 1;
          question.like = false
        } else {
          question.post_likes_count = parseInt(question.post_likes_count) + 1;
          question.like = true;
        }
      }
    }, (err) => {
      console.error('ERROR :', err);
      if(question.post_likes_count == ''){
        question.post_likes_count = 0;
      }
      if(question.like){
        question.post_likes_count = parseInt(question.post_likes_count) - 1;
        question.like = false
      } else {
        question.post_likes_count = parseInt(question.post_likes_count) + 1;
        question.like = true;
      }
    });
  }
  playSound(){
    setTimeout(()=>{
      let sound:any = document.getElementById("audio");
      sound.play();
    },300)
  }

  likeComment(answer) {
    this.playSound();
    let like = 1;
    if(answer.like){
      like = 0
    }
    let data = {
      like:like,
      comments_id:answer.answer_post_ID,
      from_user_id:this.userData.ID
    };
    this.user.addLikeAnswer(data).subscribe((resp) => {
      let response : any = resp;
      if(response.status){
        if(answer.likes_count == ''){
          answer.likes_count = 0;
        }
        if(answer.like){
          answer.likes_count = parseInt(answer.likes_count) - 1;
          answer.like = false
        } else {
          answer.likes_count = parseInt(answer.likes_count) + 1;
          answer.like = true;
        }
      }
    }, (err) => {
      console.error('ERROR :', err);
    });
  }

  doRefresh(refresher) {
    this.pageNumber = 0;
    this.margin='30pt';
    let formData : any = new FormData();
    formData.append('user_id',this.userData.ID);
    formData.append('pageSize',this.pageSize);
    formData.append('pageNumber',this.pageNumber);
    formData.append('cat_id',this.cat_id);
    formData.append('filter_id',this.filter_id);

    this.user.getQuestionsList(formData).subscribe((resp) => {
      let response : any = resp;
      if(response.data){
        this.questionsList = response.data;
        this.questionsList.filter(item=>{item.isViewAll = true});
        this.questionsListForSearch = this.questionsList;
      }
      this.margin='0pt';
      refresher.complete();
    }, (err) => {
      this.margin='0pt';
      refresher.complete();
      console.error('ERROR :', err);
    });
  }

  sendReply(question) {
    if (this.replyText.trim() === ''){
      return;
    }
    let data = {
      answer_id:question.answer_data[0].answer_post_ID,
      user_id:this.userData.ID,
      reply_content:this.replyText,
      question_id:question.ID
    }
    this.util.presentLoading();
    this.user.addReply(data).subscribe((resp) => {
      this.util.dismissLoading();
      this.replyText = '';
      let response : any = resp;
      if(response.status){
        question.answer_data[0].isReplyView = false;
        question.isViewAll = false;
        question.answer_data[0].isReplyDone = true;
        let pushData : any = {
          "reply_post_ID":response.data[0].reply_post_ID,
          "reply_author":response.data[0].reply_author,
          "reply_date_gmt":response.data[0].reply_date_gmt,
          "reply_content":response.data[0].reply_content,
          "likes_count":"",
          "user_profile":response.data[0].user_profile
        }
        question.answer_data[0].reply.splice(0,0,pushData);
      }
    }, (err) => {
      console.error('ERROR :', err);
      this.util.dismissLoading();
    });
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.filterOptions.ChooseFilterOption,
      buttons: [
        {
          text: this.filterOptions.TheLastQuestion,
          handler: () => {
            this.pageNumber=0;
            this.filter_id = 1;
            this.getQuestionsList(this.pageNumber,this.pageSize,this.cat_id,this.filter_id);
          }
        },
        {
          text: this.filterOptions.MostAnswered,
          handler: () => {
            this.pageNumber=0;
            this.filter_id = 2;
            this.getQuestionsList(this.pageNumber,this.pageSize,this.cat_id,this.filter_id);
          }
        },
        {
          text: this.filterOptions.LatestAnswers,
          handler: () => {
            this.pageNumber=0;
            this.filter_id = 3;
            this.getQuestionsList(this.pageNumber,this.pageSize,this.cat_id,this.filter_id);
          }
        },
        {
          text: this.filterOptions.ThereAreNoAnswers,
          handler: () => {
            this.pageNumber=0;
            this.filter_id = 4;
            this.getQuestionsList(this.pageNumber,this.pageSize,this.cat_id,this.filter_id);
          }
        }
      ]
    });
    actionSheet.present();
  }

  gotoSubmitAnswer(question: any) {
    this.navCtrl.push('SubmitAnswerPage',{question : question, userId : this.userData.ID});
  }

  search(data:any) {
    let searchText = data.value;
    this.questionsList = this.questionsListForSearch.filter(item=>{
      if(item.post_title.toLowerCase().includes(searchText.toLowerCase()) || item.post_content.toLowerCase().includes(searchText.toLowerCase())){
        return item;
      }
    });
  }

  getCategoryQuestions(category: any) {
    if(category === 'قطع غيار و ميكانيك' || category === 'Parts and Mechanics'){
      this.cat_id = 12;
    }else if(category === 'أسئلة عامة' || category === 'general questions'){
      this.cat_id = 9;
    }else if(category === 'مشاكل سيارات' || category === 'Car problems'){
      this.cat_id = 5;
    }
    this.pageNumber=0;
    this.getQuestionsList(this.pageNumber,this.pageSize,this.cat_id,this.filter_id);
  }

  scrollToTop() {
    if (this.content)
    this.content.scrollToTop();
  }

  report(data: any) {
    this.navCtrl.push('ReportPage',{item:data,type:'question'});
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

  deleteReply(id,question) {
    this.util.presentConfirm(this.commonTexts.Delete_Reply,this.commonTexts.Are_you_sure_delete).then(()=>{
      let data = {answer_id:id};
      this.util.presentLoading();
      this.user.delete(data).subscribe(response =>{
        let res : any = response;
        if(res.status){
          question.isViewAll = true;
          question.answer_data[0].isReplyDone = false;
          question.answer_data[0].reply.splice(0,1);
        }
        this.util.dismissLoading();
      },err=>{
        this.util.dismissLoading();
      })
    }).catch(()=>{
      console.log('Cancelled!');
    })
  }
}
