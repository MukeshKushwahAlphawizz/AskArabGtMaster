import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import {NewsArticlesProvider} from "../../providers/news-articles/news-articles";
import {UtilProvider} from "../../providers/util/util";
import {Content, Events} from "ionic-angular/index";
import {DomSanitizer} from '@angular/platform-browser';


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
              public event : Events,
              public sanitizer : DomSanitizer,
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
    this.event.publish('tagSelect',tag);
    this.viewController.dismiss();
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
      },800)
      this.isLoading = true;
      this.util.dismissLoading();
    },error => {
      console.error(error);
      this.util.dismissLoading();
    })
  }

  getDate() {
    return this.util.timeSince(new Date(this.newsDetail.post_date).getTime());
  }

  openRelated(related: any) {
    this.postId = related.Postid;
    this.banner = related.URL;
    this.getNewsDetails();
  }
  scrollToTop() {
    this.content.scrollToTop();
  }
}
