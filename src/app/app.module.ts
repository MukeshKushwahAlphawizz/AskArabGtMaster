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

import { User, Api } from '../providers';
import { MyApp } from './app.component';
import {Facebook} from "@ionic-native/facebook";
import {UtilProvider} from "../providers/util/util";
import { FCM } from '@ionic-native/fcm';
import { GooglePlus } from '@ionic-native/google-plus';
import {HTTP} from "@ionic-native/http";
import { SocialSharing } from '@ionic-native/social-sharing';
import {SafePipe} from "../pipes/safe/safe";
import {ProgressBarModule} from "angular-progress-bar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { AdMobPro } from '@ionic-native/admob-pro';
import {Deeplinks} from "@ionic-native/deeplinks";
import {ComponentsModule} from "../components/components.module";
import {ImageResizer} from '@ionic-native/image-resizer';
import { File } from '@ionic-native/file';
import { BackgroundMode } from '@ionic-native/background-mode';
import {IonicImageViewerModule} from "ionic-img-viewer";

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
    IonicImageViewerModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ProgressBarModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp,{
      preloadModules: true
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Api,
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
    AdMobPro,
    Deeplinks,
    ImageResizer,
    File,
    BackgroundMode,
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
