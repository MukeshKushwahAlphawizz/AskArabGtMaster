import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Content, Events, ViewController} from "ionic-angular/index";
import {UtilProvider} from "../../providers/util/util";
import {DomSanitizer} from "@angular/platform-browser";
import {NewsArticlesProvider} from "../../providers/news-articles/news-articles";
import {SocialSharing} from "@ionic-native/social-sharing";


@IonicPage()
@Component({
  selector: 'page-video-detail',
  templateUrl: 'video-detail.html',
})
export class VideoDetailPage {

  @ViewChild(Content) content: Content;
  tagList: any = [];
  gallaryImages :any = [];
  videoList: any = [];
  videoUrl:any = '';
  videoDetail:any={}
  imageBaseUrl : any = 'https://www.arabgt.com/wp-content/uploads/';
  banner:any='';
  isLoading:boolean=false;
  isLoader:boolean=false;
  postId: any = '';
  isPlayVideo: boolean = false;
  videoUrlArr: any = [];

  pageSize:any=0;
  pageNumber:any=5;
  isEmptyList: boolean = false;

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
    this.pageSize = 0;
    this.getNewsDetails();
  }

  selectTag(tag: any) {
    this.back();
    setTimeout(()=>{
      this.event.publish('tagVideoSelect',tag);
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
    this.api.getVideoDetail(data).subscribe(res=>{
      let resp : any = res;
      if (resp.status){
        this.videoDetail = resp.data;
        this.videoUrl = resp.videourl[0];
        this.videoUrlArr = resp.videourl;

        this.tagList = resp.TagName;
        this.gallaryImages = resp.Gallery;
        // this.releatedPost = resp.RelatedPost;

        this.getRelatedVideos(false).then(result=>{
          this.videoList = result;
          this.videoList = this.videoList.filter(item=>{
            if (this.postId !== item.Postid){
              return item;
            }
          })
          this.pageSize = this.pageSize+1;
          this.videoList.lenght?this.isEmptyList=false:this.isEmptyList=true;
        }).catch(err=>{
          this.videoList.lenght?this.isEmptyList=false:this.isEmptyList=true;
        })
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
    this.pageSize++;
    this.getNewsDetails();
  }
  scrollToTop() {
    this.content.scrollToTop();
  }

  playVideo() {
    this.isPlayVideo = true;
  }
  share() {
    this.socialSharing.share('ArabGT: '+'\n News :'+this.videoDetail.post_title,'', [],'https://arabgt.com/?p='+this.postId).then((succ) => {
    }).catch((err) => {
    });
  }

  getRelatedVideos(isRefresh) {
    return new Promise((resolve, reject) => {
      if (isRefresh){
        this.isLoader = true;
      }
      let formData = new FormData();
      formData.append('pageSize',this.pageSize);
      formData.append('pageNumber',this.pageNumber);
      /*formData.append('tag',this.tag);*/
      this.api.getAllVideos(formData).subscribe(res=>{
        if (isRefresh){
          setTimeout(()=>{
            this.isLoader = false;
          },300);
        }
        let resp:any = res;
        if (resp.status){
          resolve(resp.data);
        }else {
          this.util.presentToast('لا توجد بيانات متاحة');
          reject(false);
        }
      },error => {
        reject(false);
        if (isRefresh){
          this.isLoader = false;
        }
      });
    })
  }

  loadMore() {
    this.getRelatedVideos(true).then(result=>{
      let res : any = result
      this.videoList = [...this.videoList,...res];
      this.pageSize = this.pageSize+1;
      this.videoList.lenght?this.isEmptyList=false:this.isEmptyList=true;
    }).catch(err=>{
      this.videoList.lenght?this.isEmptyList=false:this.isEmptyList=true;
    })
  }

  back() {
    this.event.publish('backToHome','1');
  }
}
