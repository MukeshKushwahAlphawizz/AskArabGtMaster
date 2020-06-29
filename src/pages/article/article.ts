import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers";
import {UtilProvider} from "../../providers/util/util";
import {el} from "@angular/platform-browser/testing/src/browser_util";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-article',
  templateUrl: 'article.html',
})
export class ArticlePage {

  articleList:any = [];
  isArticleAvailable: boolean = true;
  private pageSize: number = 10;
  private pageNumber: number = 0;
  private language: string = 'en';
  constructor(public navCtrl: NavController,
              public user: User,
              public util:UtilProvider,
              public storage:Storage,
              public navParams: NavParams) {
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
  }

  ionViewDidLoad() {
  }

  ngOnInit(){
    this.getAllArticles(false,true);
  }
  gotoWriteArticle() {
    this.navCtrl.push('WriteArticlePage');
  }

  openReadArticle(article) {
    this.navCtrl.push('ReadArticlePage', {articleDetail : article})
  }

  openMyProfile(b) {
    this.navCtrl.push('MyProfilePage',{isOtherUserProfile : b})
  }

  private getAllArticles(isRefresh,isLoader) {
    return new Promise( (resolve, reject) => {
      if(isLoader){
        this.util.presentLoading();
      }
      let formData : any = new FormData();
      formData.append('pageSize',this.pageSize);
      formData.append('pageNumber',this.pageNumber);
      this.user.getArticalsList(formData).subscribe((resp) => {
        let response :any= resp;
        if (isRefresh){
          this.articleList = response.data;
        }else {
          this.articleList = [...this.articleList, ...response.data];
        }
        this.pageNumber = this.pageNumber + 1;

        this.articleList.length?this.isArticleAvailable=true:this.isArticleAvailable=false;
        if(isLoader){
          this.util.dismissLoading();
        }
        if(response.status){
          resolve();
        }else {
          this.util.presentToast(response.message);
          reject();
        }
      }, (err) => {
        console.error('ERROR :', err);
        reject();
        if(isLoader){
          this.util.dismissLoading();
        }
        this.util.presentToast(err.error.message);
      });
    })
  }

  loadMoreArticles(infiniteScroll) {
    setTimeout(()=>{
      this.getAllArticles(false,false).then(()=>{
        infiniteScroll.complete();
      }).catch(()=>{
        infiniteScroll.complete();
      })
    },500)
  }

  doRefresh(refresher) {
    this.pageNumber = 0;
    this.getAllArticles(true,false).then(()=>{
      refresher.complete();
    }).catch(()=>{
      refresher.complete();
    })
  }
}
