import {Component, ViewChild} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = 'HomePage';
  tab2Root: any = 'AskQuestionPage';
  /*tab3Root: any = 'ArticlePage';*/
  tab4Root: any = 'NotificationPage';

  tab1Title = " ";
  tab2Title = " ";
  // tab3Title = " ";
  tab4Title = " ";
  tabIndex: number;

  notificationRead:boolean = true;

  constructor(public navParams: NavParams,
              public navCtrl: NavController,
              public events: Events,
              public translateService: TranslateService) {
    this.tabIndex = navParams.data.tabIndex || 0;

    translateService.get("TAB").subscribe(values => {
      this.tab1Title = values['TAB1_TITLE'];
      this.tab2Title = values['TAB2_TITLE'];
      /*this.tab3Title = values['TAB3_TITLE'];*/
      this.tab4Title = values['TAB4_TITLE'];
    });
    events.subscribe('notificationRead', (isRead) => {
      this.notificationRead = isRead;
    });
  }

}
