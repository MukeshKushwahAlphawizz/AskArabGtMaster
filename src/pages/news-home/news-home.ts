import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {UtilProvider} from "../../providers/util/util";
import {NewsArticlesProvider} from "../../providers/news-articles/news-articles";
import {Content} from "ionic-angular";
import {App, Events} from "ionic-angular/index";


@IonicPage()
@Component({
  selector: 'page-news-home',
  templateUrl: 'news-home.html',
})
export class NewsHomePage {
  @ViewChild(Content) content: Content;
  selectedCategory: any = 'اختر الفئة';
  brands:any = [];
  pageSize: any = 0;
  pageNumber: any = 10;
  newsList:any = [];
  isEmptyList:boolean = false;
  imageBaseUrl : any = 'https://www.arabgt.com/wp-content/uploads/';
  tag: any = '';
  constructor(public navCtrl: NavController,
              public storage:Storage,
              public api:NewsArticlesProvider,
              public util:UtilProvider,
              public event:Events,
              public app: App,
              public navParams: NavParams) {
    this.event.subscribe('tagSelect', (value) => {
      this.tag = value;
      this.pageSize = 0;
      this.getNewsData(this.selectedCategory,true).then(succ=>{
        this.newsList = [];
        this.newsList = succ;
        this.pageSize = this.pageSize+1;
        this.newsList.length? this.isEmptyList = false:this.isEmptyList = true;
        setTimeout(()=>{
          this.scrollToTop();
        },500)
      }).catch(err=>{
        this.newsList.length? this.isEmptyList = false:this.isEmptyList = true;
      });
    })
  }
  ionViewDidLoad() {
    this.pageSize = 0;
    this.storage.get('selectedCategories').then(data=>{
      this.brands = data;
      this.getNewsData('جديد الأخبار',true).then(succ=>{
        this.newsList = succ;
        this.pageSize = this.pageSize+1;
        this.newsList.length? this.isEmptyList = false:this.isEmptyList = true;
      }).catch(err=>{
       this.newsList.length? this.isEmptyList = false:this.isEmptyList = true;
      });
    })
  }

  getNewsData(category,showLoader){
    return new Promise((resolve, reject) => {
      let form = new FormData();
      form.append('pageSize',this.pageSize);
      form.append('pageNumber',this.pageNumber);
      form.append('cat_name',category);
      form.append('tag',this.tag);
      form.append('brands',this.brands);
      if (showLoader){
        this.util.presentLoading();
      }
      this.api.getAllNews(form).subscribe(res=>{
        let resp : any = res;
        if (resp.status){
          resolve(resp.data);
        }else {
          reject(false);
        }
        if (showLoader){
          setTimeout(()=>{
            this.util.dismissLoading();
          },300);
        }
      },error => {
        console.error(error);
        if (showLoader){
          this.util.dismissLoading();
        }
        reject(false)
      })
    })
  }

  newsDetailPage(news) {
    this.app.getRootNav().push('NewsDetailPage',{postId:news.Postid,banner:news.URL});
  }

  changeCategory() {
    this.pageSize=0;
    if (this.selectedCategory !== 'اختر الفئة'){
      this.getNewsData(this.selectedCategory,true).then(succ=>{
        this.newsList = succ
        this.pageSize = this.pageSize+1;
        this.newsList.length? this.isEmptyList = false:this.isEmptyList = true;
      }).catch(err=>{
        this.newsList.length? this.isEmptyList = false:this.isEmptyList = true;
      });
    }
  }

  doRefresh(refresher) {
    this.pageSize=0;
    this.getNewsData(this.selectedCategory,false).then(succ=>{
      refresher.complete();
      this.newsList = succ;
      this.pageSize = this.pageSize+1;
      this.newsList.length? this.isEmptyList = false:this.isEmptyList = true;
      setTimeout(()=>{
        this.scrollToTop();
      },500)
    }).catch(err=>{
      refresher.complete();
      this.newsList.length? this.isEmptyList = false:this.isEmptyList = true;
    });
  }

  doInfinite(infiniteScroll) {
    this.getNewsData(this.selectedCategory,false).then(succ=>{
      infiniteScroll.complete();
      let res : any = succ
      this.newsList = [...this.newsList,...res];
      this.pageSize = this.pageSize+1;
      this.newsList.length? this.isEmptyList = false:this.isEmptyList = true;
    }).catch(err=>{
      infiniteScroll.complete();
      this.newsList.length? this.isEmptyList = false:this.isEmptyList = true;
    });
  }

  getDate(date: any) {
    return this.util.timeSince(new Date(date).getTime());
  }
  scrollToTop() {
    this.content.scrollToTop();
  }
}
