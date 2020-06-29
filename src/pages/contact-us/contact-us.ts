import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the ContactUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  name: string = '';
  email: string = '';
  messageSent: string = '';
  contactUsForm: FormGroup;
  error_messages = {
    name: [
      { type: "required", message: "Name is required." }
    ],
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Please enter a valid email address." }
    ],

    message: [
      { type: "required", message: "*Please enter your message." },
    ]
  };
  private language: string = 'en';

  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public util:UtilProvider,
              public user: User,
              public storage : Storage,
              public translateService : TranslateService,
              public navParams: NavParams) {
    translateService.get("Contact").subscribe(values => {
      this.messageSent = values.MessageSend;
    });
    translateService.get("CommonErrMsg").subscribe(values => {
      this.error_messages = {
        name: [
          { type: "required", message: values.Name_required }
        ],
        email: [
          { type: "required", message: values.EmailRequired },
          { type: "pattern", message: values.EnterValidEmail }
        ],

        message: [
          { type: "required", message: values.EnterMessage }
        ]
      };
    });
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
    this.setupFormData();
  }
  private setupFormData() {
    this.contactUsForm = this.formBuilder.group(
      {
        name: new FormControl(
          "",
          Validators.compose([
            Validators.required
          ])
        ),
        email: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
          ])
        ),
        message: new FormControl(
          "",
          Validators.compose([
            Validators.required,
          ])
        )
      }
    );
  }

  ionViewDidLoad() {
  }

  send() {
    this.storage.get('userId').then(userId=>{
      let formData = new FormData();
      formData.append('message',this.contactUsForm.value.message);
      formData.append('email',this.contactUsForm.value.email);
      formData.append('name',this.contactUsForm.value.name);
      formData.append('user_id',userId);
      this.util.presentLoading();
      this.user.contactUs(formData).subscribe((resp) => {
        let response:any = resp;
        console.log(response);
        if (response.status){
          this.setupFormData();
          this.util.presentToast(this.messageSent);
        }
        this.util.dismissLoading();
      }, (err) => {
        this.util.dismissLoading();
      });
    })
  }
  openSocial(url) {
    window.open(url);
  }
}
