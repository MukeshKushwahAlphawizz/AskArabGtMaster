import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {App, Content, Events, ModalController} from "ionic-angular/index";
import {UtilProvider} from "../../providers/util/util";
import {NewsArticlesProvider} from "../../providers/news-articles/news-articles";

/**
 * Generated class for the VideoListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-video-list',
  templateUrl: 'video-list.html',
})
export class VideoListPage {
  videoList: any = [];

  @ViewChild(Content) content: Content;
  pageSize:any=0;
  pageNumber:any=10;
  isEmptyList: boolean = false;
  imageBaseUrl : any = 'https://www.arabgt.com/wp-content/uploads/';
  tag: any = '';

  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public modal:ModalController,
              public api:NewsArticlesProvider,
              public event:Events,
              public app:App,
              public navParams: NavParams) {
    this.event.subscribe('tagVideoSelect', (value) => {
      this.tag = value;
      this.pageSize = 0;
      this.getVideoList(true).then(succ=>{
        this.videoList = succ;
        this.pageSize = this.pageSize+1;
        this.videoList.lenght?this.isEmptyList=false:this.isEmptyList=true;
        setTimeout(()=>{
          this.scrollToTop();
        },500)
      }).catch(err=>{
        this.videoList.lenght?this.isEmptyList=false:this.isEmptyList=true;
      });
    })
  }

  ionViewDidLoad() {
    this.pageSize = 0;
    this.getVideoList(true).then(result=>{
      this.videoList = result;
      this.pageSize = this.pageSize+1;
      this.videoList.lenght?this.isEmptyList=false:this.isEmptyList=true;
    }).catch(err=>{
      this.videoList.lenght?this.isEmptyList=false:this.isEmptyList=true;
    })
  }

  videoDetailPage(video) {
    this.app.getRootNav().push('NewsMenuPage',{postId:video.Postid,banner:video.URL,type:1});
    // this.app.getRootNav().push('VideoDetailPage',{postId:video.Postid,banner:video.URL});
  }

  getVideoList(isRefresh) {
    return new Promise((resolve, reject) => {
      if (isRefresh){
        this.util.presentLoading();
      }
      let formData = new FormData();
      formData.append('pageSize',this.pageSize);
      formData.append('pageNumber',this.pageNumber);
      /*formData.append('tag',this.tag);*/
      this.api.getAllVideos(formData).subscribe(res=>{
        if (isRefresh){
          setTimeout(()=>{
            this.util.dismissLoading();
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
          this.util.dismissLoading();
        }
      });
    })
  }

  doRefresh(refresher) {
    this.pageSize = 0;
    this.getVideoList(false).then(result=>{
      refresher.complete();
      this.videoList = result;
      this.pageSize = this.pageSize+1;
      this.videoList.lenght?this.isEmptyList=false:this.isEmptyList=true;
    }).catch(err=>{
      refresher.complete();
      this.videoList.lenght?this.isEmptyList=false:this.isEmptyList=true;
    })
  }

  doInfinite(infiniteScroll) {
    this.getVideoList(false).then(result=>{
      infiniteScroll.complete();
      let res : any = result
      this.videoList = [...this.videoList,...res];
      this.pageSize = this.pageSize+1;
      this.videoList.lenght?this.isEmptyList=false:this.isEmptyList=true;
    }).catch(err=>{
      infiniteScroll.complete();
      this.videoList.lenght?this.isEmptyList=false:this.isEmptyList=true;
    })
  }

  getDate(date: any) {
    return this.util.timeSince(new Date(date).getTime());
  }
  scrollToTop() {
    this.content.scrollToTop();
  }


}
