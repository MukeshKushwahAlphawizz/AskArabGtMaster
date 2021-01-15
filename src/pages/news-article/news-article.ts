import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {NewsArticlesProvider} from "../../providers/news-articles/news-articles";
import {App, Content, Events, ModalController, Platform} from "ionic-angular/index";
@IonicPage()
@Component({
  selector: 'page-news-article',
  templateUrl: 'news-article.html',
})
export class NewsArticlePage {
  @ViewChild(Content) content: Content;
  pageSize:any=0;
  pageNumber:any=10;
  articleList: any = [];
  brandList: any = [];
  isEmptyList: boolean = false;
  imageBaseUrl : any = 'https://www.arabgt.com/wp-content/uploads/';
  tag: any = '';
  brand: any = 'اختر الماركة'; //select brand

  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public platform:Platform,
              public modal:ModalController,
              public api:NewsArticlesProvider,
              public event:Events,
              public app: App,
              public navParams: NavParams) {
    this.event.subscribe('tagSelectArticle', (value) => {
      this.tag = value;
      this.pageSize = 0;
      this.getArticlesList(true).then(succ=>{
        this.articleList = succ;
        this.pageSize = this.pageSize+1;
        this.articleList.lenght?this.isEmptyList=false:this.isEmptyList=true;
        setTimeout(()=>{
          this.scrollToTop();
        },500)
      }).catch(err=>{
        this.articleList.lenght?this.isEmptyList=false:this.isEmptyList=true;
      });
    })
  }

  ionViewDidLoad() {
    this.getBrandList();
    this.pageSize = 0;
    this.getArticlesList(true).then(result=>{
      this.articleList = result;
      this.pageSize = this.pageSize+1;
      this.articleList.lenght?this.isEmptyList=false:this.isEmptyList=true;
    }).catch(err=>{
      this.articleList.lenght?this.isEmptyList=false:this.isEmptyList=true;
    })
  }

  articleDetailPage(article) {
    this.app.getRootNav().push('NewsMenuPage',{postId:article.Postid,banner:article.URL,type:2});
    // this.app.getRootNav().push('ArticleDetailPage',{postId:article.Postid,banner:article.URL});
  }

  getBrandList() {
    this.api.getBrandList().subscribe(res=>{
      let resp:any = res;
      if (resp.status){
        this.brandList = resp.data;
      }
    });
  }

  getArticlesList(isRefresh) {
    return new Promise((resolve, reject) => {
      if (isRefresh){
        this.util.presentLoading();
      }
      let formData = new FormData();
      formData.append('pageSize',this.pageSize);
      formData.append('pageNumber',this.pageNumber);
      formData.append('tag',this.tag);
      formData.append('brands',this.brand!=='اختر الماركة'?this.brand:'');
      this.api.getAllArticles(formData).subscribe(res=>{
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
    this.getArticlesList(false).then(result=>{
      refresher.complete();
      this.articleList = result;
      this.pageSize = this.pageSize+1;
      this.articleList.lenght?this.isEmptyList=false:this.isEmptyList=true;
    }).catch(err=>{
      refresher.complete();
      this.articleList.lenght?this.isEmptyList=false:this.isEmptyList=true;
    })
  }

  doInfinite(infiniteScroll) {
    this.getArticlesList(false).then(result=>{
      infiniteScroll.complete();
      let res : any = result
      this.articleList = [...this.articleList,...res];
      this.pageSize = this.pageSize+1;
      this.articleList.lenght?this.isEmptyList=false:this.isEmptyList=true;
    }).catch(err=>{
      infiniteScroll.complete();
      this.articleList.lenght?this.isEmptyList=false:this.isEmptyList=true;
    })
  }

  getDate(date: any) {
    if (this.platform.is('ios')){
      return date;
    }else {
      return this.util.timeSince(new Date(date).getTime());
    }
    // return this.util.timeSince(new Date(date).getTime());
  }
  scrollToTop() {
    this.content.scrollToTop();
  }

  selectBrands() {
    let modal = this.modal.create('SelectBrandPage',{brandList:JSON.stringify(this.brandList)});
    modal.present();
    modal.onDidDismiss(data=>{
      this.brand = data.brandName;
      this.pageSize = 0;
      this.getArticlesList(true).then(result=>{
        this.articleList = result;
        this.pageSize = this.pageSize+1;
        this.articleList.lenght?this.isEmptyList=false:this.isEmptyList=true;
      }).catch(err=>{
        this.articleList.lenght?this.isEmptyList=false:this.isEmptyList=true;
      })
    })
  }
}
