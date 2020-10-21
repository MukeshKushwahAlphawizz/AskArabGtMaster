import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Content, Events, ViewController} from "ionic-angular/index";
import {UtilProvider} from "../../providers/util/util";
import {DomSanitizer} from "@angular/platform-browser";
import {NewsArticlesProvider} from "../../providers/news-articles/news-articles";
import {SocialSharing} from "@ionic-native/social-sharing";

/**
 * Generated class for the VideoDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-video-detail',
  templateUrl: 'video-detail.html',
})
export class VideoDetailPage {

  @ViewChild(Content) content: Content;
  tagList: any = [];
  gallaryImages :any = [];
  releatedPost :any = [];
  videoUrl:any = '';
  videoDetail:any={}
  imageBaseUrl : any = 'https://www.arabgt.com/wp-content/uploads/';
  banner:any='';
  isLoading:boolean=false;
  postId: any = '';
  isPlayVideo: boolean = false;
  videoUrlArr: any = [];
  constructor(public navCtrl: NavController,
              public util : UtilProvider,
              public event : Events,
              public socialSharing : SocialSharing,
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
    this.event.publish('tagVideoSelect',tag);
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
    this.api.getVideoDetail(data).subscribe(res=>{
      let resp : any = res;
      if (resp.status){
        this.videoDetail = resp.data;
        this.videoUrl = resp.videourl[0];
        this.videoUrlArr = resp.videourl;

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
    return this.util.timeSince(new Date(this.videoDetail.post_date).getTime());
  }

  openRelated(related: any) {
    this.postId = related.Postid;
    this.banner = related.URL;
    this.getNewsDetails();
  }
  scrollToTop() {
    this.content.scrollToTop();
  }

  playVideo() {
    this.isPlayVideo = true;
  }
  share() {
    this.socialSharing.share('ArabGT: '+'\n News :'+this.videoDetail.post_title,'', [],'').then((succ) => {
    }).catch((err) => {
    });
  }
}