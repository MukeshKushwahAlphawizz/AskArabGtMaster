import { Injectable } from '@angular/core';
import {Phase2ApisProvider} from "../phase2-apis/phase2-apis";


@Injectable()
export class NewsArticlesProvider {

  newsList : string = 'Category/News';
  newsDetail : string = 'Category/SingleNews';
  articleList : string = 'Category/Articles';
  articleDetails : string = 'Category/SingleArticle';
  videoArticles : string = 'Category/VideosArticles';
  singleArticleVideos : string = 'Category/SingleArticleVideos';
  brandList : string = 'Category/BrandList';

  constructor(public api: Phase2ApisProvider) {
  }

  getAllNews(data) {
    let seq = this.api.post(this.newsList,data,{}).share();
    return seq;
  }
  getAllArticles(data) {
    let seq = this.api.post(this.articleList,data,{}).share();
    return seq;
  }
  getNewsDetail(data) {
    let seq = this.api.post(this.newsDetail,data,{}).share();
    return seq;
  }
  getArticleDetail(data) {
    let seq = this.api.post(this.articleDetails,data,{}).share();
    return seq;
  }
  getAllVideos(data) {
    let seq = this.api.post(this.videoArticles,data,{}).share();
    return seq;
  }
  getVideoDetail(data) {
    let seq = this.api.post(this.singleArticleVideos,data,{}).share();
    return seq;
  }
  getBrandList() {
    let seq = this.api.get(this.brandList,{},{}).share();
    return seq;
  }

}
