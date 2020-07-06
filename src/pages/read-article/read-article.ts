import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import moment from "moment";
import {Storage} from "@ionic/storage";
import {User} from "../../providers";
import {animate, state, style, transition, trigger} from "@angular/animations";


@IonicPage()
@Component({
  selector: 'page-read-article',
  templateUrl: 'read-article.html',
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
export class ReadArticlePage {
  articleDetail:any={};
  replyText: any = '';
  comment: string = '';
  userId:any = '';
  isAllowToReply: number = 1;
  private language: string = 'ar';
  constructor(public navCtrl: NavController,
              public util: UtilProvider,
              public storage : Storage,
              public user: User,
              public navParams: NavParams) {
    this.articleDetail = this.navParams.data.articleDetail;
    // console.log(JSON.stringify(this.articleDetail));
    storage.get('userId').then(data=>{
      this.userId = data;
    })
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReadArticlePage');
  }

  openMyProfile() {
    this.navCtrl.push('MyProfilePage');
  }

  reply(comment) {
    (comment.isReplyView)?comment.isReplyView = false:comment.isReplyView=true;
  }

  sendReply(comment: any) {
    if (this.replyText.trim() === ''){
      return;
    }
    let data = {
      article_id:this.articleDetail.ID,
      user_id:this.userId,
      reply_content:this.replyText,
      allow_to_reply:this.isAllowToReply,
      comment_parent:comment.comment_ID
    }

    this.util.presentLoading();
    this.user.addReplyOnCommentData(data).subscribe((resp) => {
      this.util.dismissLoading();
      let response : any = resp;
      console.log('response add reply >>>',response);
      if(response.status){
        comment.isReplyView = false;
        this.replyText = '';
        let pushData : any = {
          "reply_ID":response.data[0].reply_ID,
          "reply_post_ID":response.data[0].reply_post_ID,
          "reply_author":response.data[0].reply_author,
          "reply_date_gmt":response.data[0].reply_date_gmt,
          "reply_content":response.data[0].reply_content,
          "user_profile":response.data[0].user_profile
        }
        comment.reply_data.push(pushData);
      }
    }, (err) => {
      console.error('ERROR :', err);
      this.util.dismissLoading();
    });
  }

  addComment() {
    if (this.comment.trim() === ''){
      return;
    }
    let data = {
      user_id:this.userId,
      article_id:this.articleDetail.ID,
      comment_content:this.comment,
      allow_to_reply:this.isAllowToReply,
    };
    this.util.presentLoading();
    this.user.addCommentOnArticleData(data).subscribe((resp) => {
      this.util.dismissLoading();
      let response : any = resp;
      console.log('response add comment >>>',response);
      if(response.status){
        this.comment = '';
        // this.isAllowToReply = 0;
        let pushData : any = {
          "comment_post_ID":response.data[0].comment_post_ID,
          "comment_ID":response.data[0].comment_ID,
          "comment_author":response.data[0].comment_author,
          "comment_date_gmt":response.data[0].comment_date_gmt,
          "comment_content":response.data[0].comment_content,
          "allow_to_reply":response.data[0].allow_to_reply,
          "user_profile":response.data[0].user_profile,
          "reply_data":[],
        };
        this.articleDetail.comment_data.push(pushData);
        this.util.presentToast('Comment Added Successfully');
      }
    }, (err) => {
      console.error('ERROR :', err);
      this.util.dismissLoading();
    });
  }

  allowToReply() {
    this.isAllowToReply?this.isAllowToReply=0:this.isAllowToReply=1;
    console.log('is allow to reply',this.isAllowToReply);
  }
}
