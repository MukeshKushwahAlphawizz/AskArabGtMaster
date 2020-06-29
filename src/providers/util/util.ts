import { Injectable } from '@angular/core';
import {
  LoadingController, ToastController,
  Loading, ModalController, AlertController, Platform, Config, Events
} from 'ionic-angular';
import {Camera} from "@ionic-native/camera";
import moment from "moment";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from "@ionic/storage";

export const CATEGORY_ID = {
  value : 0
};

@Injectable()
export class UtilProvider {
  loading: Loading;
  pleaseWait:string='';
  constructor(private loadingCtrl: LoadingController,
     private toastCtrl: ToastController,
     private alertCtrl: AlertController,
     private camera: Camera,
     public platform:Platform,
     public storage:Storage,
     public events : Events,
     public translateService : TranslateService
   ) {
    this.initTranslate();
    translateService.get("PleaseWait").subscribe(values => {
      this.pleaseWait = values;
    });
    events.subscribe('appLanguage', (value) => {
      this.initTranslate();
    });
  }
  initTranslate() {
    this.storage.get('appLanguage').then(data=>{
      if(data && data == 'ar'){
        this.translateService.setDefaultLang('ar');
        this.translateService.use('ar');
      }else {
        this.translateService.setDefaultLang('en');
        this.translateService.use('en');
      }
      this.translateService.get("PleaseWait").subscribe(values => {
        this.pleaseWait = values;
      });
    });
  }
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: this.pleaseWait,
      duration: 5000
    });

    this.loading.onDidDismiss(() => {
      // console.log('Dismissed loading');
    });

    this.loading.present();
  }

  dismissLoading(){
    if(this.loading) {
      this.loading.dismiss();
    }
  }
//FOR PRESENT TOAST
  presentToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
//FOR BASIC TOAST
  presentCustomToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'dark-trans',
      closeButtonText: 'OK',
      showCloseButton: true
    });
    toast.present();
  }
//FOR ERROR TOAST
  presentErrorToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'error-toast',
      closeButtonText: 'OK',
      showCloseButton: true
    });
    toast.present();
  }
//FOR DATA NOT FOUND ERROR
presentAlertData() {
  let alert = this.alertCtrl.create({
    title: 'Data not found',
    subTitle: 'Something went wrong',
    cssClass: 'alertDanger',
    buttons: [
      {
      text: 'Try Again!',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
        this.presentErrorToast('No result found');
      }
    }
    ]
  });
  alert.present();
}
  //FOR BASIC SERVER ERROR
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Server Error',
      subTitle: 'Something went wrong',
      cssClass: 'alertDanger',
      buttons: [
        {
        text: 'Try Again!',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
          this.platform.exitApp();
        }
      }
      ]
    });
    alert.present();
  }
//FOR CONFIRM NETWORK ERROR
  presentNetwork() {
    let alert = this.alertCtrl.create({
      title: 'Network Error',
      message: 'Internet not connected please try again.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Ok clicked');
            //this.navCtrl.push(HomePage);
          }
        }
      ]
    });
    alert.present();
  }
//FOR CONFIRM ALERT
  presentConfirm(title,msg) {
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: title,
        message: msg,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              reject();
            }
          },
          {
            text: 'Ok',
            handler: () => {
              resolve();
            }
          }
        ]
      });
      alert.present();
    })
  }

  takePicture() :any{
    return new Promise((resolve, reject) => {
      this.camera.getPicture({
        targetWidth: 512,
        targetHeight: 512,
        correctOrientation: true,
        sourceType: this.camera.PictureSourceType.CAMERA,
        destinationType: this.camera.DestinationType.DATA_URL
      }).then((imageData) => {
          /*let blob = this.getBlob(imageData, ".jpg")
          let imageFile = new File([blob], "image.jpg")*/
          resolve({imageFile:'',imageData:imageData});
        }, (err) => {
        console.log(err);
        reject(err)
      });
    })
  }

  aceesGallery() :any{
    return new Promise((resolve, reject) => {
      this.camera.getPicture({
        sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
        destinationType: this.camera.DestinationType.DATA_URL
      }).then((imageData) => {
        // console.log('data:image/jpeg;base64,' + imageData);
        /*let blob = this.getBlob(imageData, ".jpg")
        let imageFile = new File([blob], "image.jpg")*/
        resolve({imageFile:'',imageData:imageData});
      }, (err) => {
        console.log(err);
        reject(err)
      });
    })
  }

   timeSince(date:any) {
     return moment(date).fromNow()
   }

  private getBlob(b64Data:string, contentType:string, sliceSize:number= 512) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = this.atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  // Regular expression to check formal correctness of base64 encoded strings
  b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;

  atob(string) {
    console.log('atob function called !@!@!');
    // atob can work with strings with whitespaces, even inside the encoded part,
    // but only \t, \n, \f, \r and ' ', which can be stripped.
    string = String(string).replace(/[\t\n\f\r ]+/g, "");
    if (!this.b64re.test(string))
      throw new TypeError("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");

    // Adding the padding if missing, for semplicity
    string += "==".slice(2 - (string.length & 3));
    var bitmap, result = "",
      r1, r2, i = 0;
    for (; i < string.length;) {
      bitmap = this.b64.indexOf(string.charAt(i++)) << 18 | this.b64.indexOf(string.charAt(i++)) << 12 |
        (r1 = this.b64.indexOf(string.charAt(i++))) << 6 | (r2 = this.b64.indexOf(string.charAt(i++)));

      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) :
        r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) :
          String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  }

  randomImg(){
    let randomNumber = Math.floor(Math.random() * 1000) + 1;
    return "image" + randomNumber;
  }

  showInputAlert(title,msg,inputPlaceholder,value) {
    return new Promise((resolve, reject) => {
      let promptAlert = this.alertCtrl.create({
        title: title,
        message: msg,
        inputs: [
          {
            name: 'edit',
            value:value,
            placeholder: inputPlaceholder
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              reject(data);
            }
          },
          {
            text: 'Submit',
            handler: data => {
              resolve(data.edit.trim());
            }
          }
        ]
      });
      promptAlert.present();
    });
  }

  showInputAlertWithMultipleInput(title,msg,inputPlaceholder,value,descriptionValue,descriptionPlaceholder) {
    return new Promise((resolve, reject) => {
      let promptAlert = this.alertCtrl.create({
        title: title,
        message: msg,
        inputs: [
          {
            name: 'edit',
            value:value,
            placeholder: inputPlaceholder
          },
          {
            name: 'editSubTitle',
            value:descriptionValue,
            placeholder: descriptionPlaceholder
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              reject(data);
            }
          },
          {
            text: 'Submit',
            handler: data => {
              resolve({title:data.edit.trim(),subtitle:data.editSubTitle.trim()});
            }
          }
        ]
      });
      promptAlert.present();
    });
  }

  getRank(name){
    let rankColor = ''
    switch (name) {
      case 'A New member': rankColor = '#6baa0b'
        break;
      case 'Platinum member': rankColor = '#bfad6e';
        break;
      case 'Gold member': rankColor = '#d3ab28';
        break;
      case 'Silver Member': rankColor = '#bfbfbf'
        break;
      case 'Bronze member':rankColor = '#cc7926';
        break;
      default: rankColor = '#6baa0b'
        break;
    }
    return rankColor;
  }
}
