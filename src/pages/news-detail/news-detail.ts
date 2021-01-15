import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import {NewsArticlesProvider} from "../../providers/news-articles/news-articles";
import {UtilProvider} from "../../providers/util/util";
import {Content, Events, Platform} from "ionic-angular/index";
import {DomSanitizer} from '@angular/platform-browser';
import {SocialSharing} from "@ionic-native/social-sharing";


@IonicPage()
@Component({
  selector: 'page-news-detail',
  templateUrl: 'news-detail.html',
})
export class NewsDetailPage {
  @ViewChild(Content) content: Content;
  tagList: any = [];
  gallaryImages :any = [];
  releatedPost :any = [];
  newsDetail:any={}
  imageBaseUrl : any = 'https://www.arabgt.com/wp-content/uploads/';
  banner:any='';
  isLoading:boolean=false;
  postId: any = '';
  constructor(public navCtrl: NavController,
              public util : UtilProvider,
              public platform : Platform,
              public event : Events,
              public sanitizer : DomSanitizer,
              public socialSharing: SocialSharing,
              public viewController : ViewController,
              public api : NewsArticlesProvider,
              public navParams: NavParams) {
    this.banner = navParams.data.banner;
    this.postId = this.navParams.data.postId;
  }

  ionViewDidLoad() {
    this.getNewsDetails();
  }

  selectTag(tag: any) {
    this.back();
    setTimeout(()=>{
      this.event.publish('tagSelect',tag);
    },500)
  }
  getSenitizedUrl(html){
    return  this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getNewsDetails(){
    let data = {
      post_id:this.postId
    }
    this.util.presentLoading();
    this.api.getNewsDetail(data).subscribe(res=>{
      let resp : any = res;
      if (resp.status){
        this.newsDetail = resp.data;
        this.tagList = resp.TagName;
        this.gallaryImages = resp.Gallery;
        this.releatedPost = resp.RelatedPost;
      }
      setTimeout(()=>{
        this.scrollToTop();
        this.util.dismissLoading();
      },800)
      this.isLoading = true;
    },error => {
      console.error(error);
      this.util.dismissLoading();
    })
  }

  getDate() {
    if (this.platform.is('ios')){
      return this.newsDetail.post_date;
    }else {
      return this.util.timeSince(new Date(this.newsDetail.post_date).getTime());
    }
  }

  openRelated(related: any) {
    this.postId = related.Postid;
    this.banner = related.URL;
    this.getNewsDetails();
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  share() {
    this.socialSharing.share('ArabGT: '+'\n News :'+this.newsDetail.post_title,'', [],'https://arabgt.com/?p='+this.postId).then((succ) => {
    }).catch((err) => {
    });
  }

  back() {
    this.event.publish('backToHome','3');
  }
}
