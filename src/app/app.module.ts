import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Items } from '../mocks/providers/items';
import { User, Api } from '../providers';
import { MyApp } from './app.component';
import {Facebook} from "@ionic-native/facebook";
import {UtilProvider} from "../providers/util/util";
import { FCM } from '@ionic-native/fcm';
import { GooglePlus } from '@ionic-native/google-plus';
import {HTTP} from "@ionic-native/http";
import { SocialSharing } from '@ionic-native/social-sharing';
import {SafePipe} from "../pipes/safe/safe";
import { PhotoViewer } from '@ionic-native/photo-viewer';
import {ProgressBarModule} from "angular-progress-bar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { AdMobPro } from '@ionic-native/admob-pro';
import {Deeplinks} from "@ionic-native/deeplinks";

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ProgressBarModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Api,
    Items,
    User,
    Camera,
    Facebook,
    SplashScreen,
    StatusBar,
    UtilProvider,
    FCM,
    HTTP,
    GooglePlus,
    SocialSharing,
    PhotoViewer,
    AdMobPro,
    Deeplinks,
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
