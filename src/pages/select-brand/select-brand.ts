import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ViewController} from "ionic-angular/index";


@IonicPage()
@Component({
  selector: 'page-select-brand',
  templateUrl: 'select-brand.html',
})
export class SelectBrandPage {

  brandListMain : any = [];
  brandList : any = [];
  pageNumber :number = 1;
  pageSize:number = 30;
  constructor(public navCtrl: NavController,
              public viewCtrl : ViewController,
              public navParams: NavParams) {
    let data = navParams.data.brandList;
    this.brandListMain = JSON.parse(data);
  }

  ionViewDidLoad() {
    this.pageNumber = 1;
    this.getBrandList(true).then(res=>{
      this.brandList = res;
    }).catch(err=>{});
  }

  back() {
    this.viewCtrl.dismiss();
  }

  getBrandList(isRefresh) {
    return new Promise((resolve, reject) => {
        let list = [];
        let start = 0;
        let end = 0;
        if (isRefresh){
          start = 0
          end = this.pageSize;
        }else{
          start = this.pageSize*this.pageNumber;
          end = (this.pageSize*this.pageNumber)+this.pageSize
        }
        for (let i = start; i < end; i++) {
          if (i<this.brandListMain.length-1){
            list.push(this.brandListMain[i]);
          }else {
            return;
          }
        }
        resolve(list);
        this.pageNumber++;
    })
  }

  selectBrand(brand: any) {
    console.log(brand);
    this.viewCtrl.dismiss({brandName:brand.Brand});
  }

  doInfinite(infiniteScroll) {
    this.getBrandList(false).then(res=>{
      setTimeout(()=>{
        let list : any = res;
        this.brandList = [...this.brandList,...list];
        infiniteScroll.complete();
      },800);
    }).catch(err=>{
      console.log('err',err);
    });
  }
}
