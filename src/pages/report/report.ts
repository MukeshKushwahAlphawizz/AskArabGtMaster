import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {

  reportData:any = {};
  reportText: any = '';
  type: any = 'question';
  profileImage: any = '';
  content: any = '';
  private EnterReportContent: string = '';
  private SuccessMsg: string = '';
  rank: string = '';
  language: string = 'en';

  constructor(public navCtrl: NavController,
              public util: UtilProvider,
              public user : User,
              public viewCtrl : ViewController,
              public translateService : TranslateService,
              public storage : Storage,
              public navParams: NavParams) {
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
    this.reportData = navParams.data.item;
    console.log(JSON.stringify(this.reportData));
    this.type = navParams.data.type;

    if (this.type === 'question'){
      this.profileImage = this.reportData.post_user_profile;
      this.content = this.reportData.post_title;
      this.rank = this.reportData.question_user_rank;
    }else {
      this.profileImage = this.reportData.user_profile;
      this.content = this.reportData.answer_content;
      this.rank = this.reportData.answer_user_rank;
    }
    translateService.get("Report").subscribe(values => {
      this.EnterReportContent = values.EnterReportContent;
      this.SuccessMsg = values.SuccessMsg;
    });
  }

  ionViewDidLoad() {
  }

  report() {
    if (this.reportText === ''){
      this.util.presentToast(this.EnterReportContent);
      return;
    }

    let data = {
      post_id:this.type ==='question'?this.reportData.ID:this.reportData.answer_post_ID,
      report_content:this.reportText,
      type:this.type === 'question'?1:2
    }
    this.util.presentLoading();
    this.user.submitReport(data).subscribe((resp) => {
      this.util.dismissLoading();
      let response : any = resp;
      if(response.status){
        this.reportText = '';
        this.util.presentToast(this.SuccessMsg);
        this.viewCtrl.dismiss();
      }
    }, (err) => {
      this.util.dismissLoading();
    });
  }
}
