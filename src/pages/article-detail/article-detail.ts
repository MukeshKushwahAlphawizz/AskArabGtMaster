import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Content, Events, Platform, ViewController} from "ionic-angular/index";
import {UtilProvider} from "../../providers/util/util";
import {DomSanitizer} from "@angular/platform-browser";
import {NewsArticlesProvider} from "../../providers/news-articles/news-articles";
import {SocialSharing} from "@ionic-native/social-sharing";


@IonicPage()
@Component({
  selector: 'page-article-detail',
  templateUrl: 'article-detail.html',
})
export class ArticleDetailPage {
  @ViewChild(Content) content: Content;
  tagList: any = [];
  gallaryImages :any = [];
  releatedPost :any = [];
  articleDetail:any={};
  imageBaseUrl : any = 'https://www.arabgt.com/wp-content/uploads/';
  banner:any='';
  isLoading:boolean=false;
  postId: any = '';

  constructor(public navCtrl: NavController,
              public util : UtilProvider,
              public platform : Platform,
              public event : Events,
              public sanitizer : DomSanitizer,
              public socialSharing : SocialSharing,
              public viewController : ViewController,
              public api : NewsArticlesProvider,
              public navParams: NavParams) {
    this.banner = navParams.data.banner;
    this.postId = this.navParams.data.postId;
  }

  ionViewDidLoad() {
    this.getArticleDetails();
  }

  selectTag(tag: any) {
    this.back();
    setTimeout(()=>{
      this.event.publish('tagSelectArticle',tag);
    },500)
  }
  getSenitizedUrl(html){
    return  this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getArticleDetails(){
    let data = {
      post_id:this.postId
    }
    // test id 241925
    this.util.presentLoading();
    this.api.getArticleDetail(data).subscribe(res=>{
      let resp : any = res;
      if (resp.status){
        this.articleDetail = resp.data;
        this.tagList = resp.TagName;
        this.gallaryImages = resp.Gallery;
        this.releatedPost = resp.RelatedPost;
      }
      setTimeout(()=>{
        this.scrollToTop();
      },800)
      this.isLoading = true;
      setTimeout(()=>{
        this.util.dismissLoading();
      },300);
    },error => {
      console.error(error);
      this.util.dismissLoading();
    })
  }

  getDate() {
    if (this.platform.is('ios')){
      return this.articleDetail.post_date;
    }else {
      return this.util.timeSince(new Date(this.articleDetail.post_date).getTime());
    }
  }

  openRelated(related: any) {
    this.postId = related.Postid;
    this.banner = related.URL;
    this.getArticleDetails();
  }
  scrollToTop() {
    this.content.scrollToTop();
  }

  share() {
    this.socialSharing.share('ArabGT: '+'\n Review :'+this.articleDetail.post_title,'', [],'https://arabgt.com/?p='+this.postId).then((succ) => {
    }).catch((err) => {
    });
  }

  back() {
    this.event.publish('backToHome','2');
  }
}
