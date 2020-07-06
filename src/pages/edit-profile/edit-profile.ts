import { Component } from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../providers";
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";
import {TranslateService} from "@ngx-translate/core";


@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  profileForm: FormGroup;
  error_messages:any = {};
  userData:any={};
  userImage: any = '';
  userProfileToSend : any = '';
  countryList: any = [];
  stateList: any = [];
  commonTexts: any = {};
  ProfileEditedSuccessfully: string = '';
  fromSignUp: boolean = false;
  language: string = 'ar';
  constructor(public user: User, public actionSheetCtrl: ActionSheetController,
              public navCtrl: NavController,public util:UtilProvider,
              public storage : Storage,
              public translateService : TranslateService,
              public navParams: NavParams, public viewCtrl: ViewController,
              public formBuilder: FormBuilder) {
    navParams.data.fromSignUp?this.fromSignUp=navParams.data.fromSignUp:this.fromSignUp=false;
    this.storage.get('appLanguage').then(data=>{
      this.language = data;
    })
    this.setProfileFormData();
    this.storage.get('userData').then(data=>{
      this.userData = JSON.parse(data);
      this.populateData();
    })
    this.populateLanguageData();
  }
  private populateLanguageData() {
    this.translateService.get("CommonErrMsg").subscribe(values => {
      this.error_messages = {
        name: [{ type: "required", message: values.Name_required }],
        lastname: [
          { type: "required", message: values.Lastname_required },
        ],
        address: [
          { type: "required", message: values.Address_required },
        ],
        mobilenumber: [
          { type: "required", message: values.MobileNumber_required },
          { type: "minlength", message: values.Minimumlength10 },
          { type: "maxlength", message: values.Maximumlength12 }
        ],
        datebirth: [
          { type: "required", message: values.DOBrequired },
        ]
      };
    });
    this.translateService.get("EditProfile").subscribe(values => {
      this.ProfileEditedSuccessfully = values.ProfileEditedSuccessfully;
    });
    this.translateService.get("Common").subscribe(values => {
      this.commonTexts = values;
    });
  }

  ngOnInit(){
    this.getCountryList()
  }
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.commonTexts.Choose_take_picture,
      buttons: [
        {
          text: this.commonTexts.Take_picture,
          handler: () => {
            this.util.takePicture().then(data =>{
              this.userImage = 'data:image/png;base64,'+data.imageData;
              this.userProfileToSend = 'data:image/png;base64,'+data.imageData;
            });
          }
        },
        {
          text: this.commonTexts.Choose_picture,
          handler: () => {
            this.util.aceesGallery().then(data =>{
              this.userImage = 'data:image/png;base64,'+data.imageData;
              this.userProfileToSend = 'data:image/png;base64,'+data.imageData;
            });
          }
        }
      ]
    });
    actionSheet.present();
  }

  ionViewDidLoad() {
  }


  openMyProfile(isOtherUser: boolean) {
    this.navCtrl.push('MyProfilePage',{isOtherUserProfile : isOtherUser})
  }

  save() {
    let profileImage = '';
    if(this.userProfileToSend !== 'assets/img/profile-default.jpeg'){
      profileImage = this.userProfileToSend;
    }
    let formData = new FormData();
    formData.append('ID',this.userData.ID);
    formData.append('user_profile',profileImage);
    formData.append('first_name',this.profileForm.value.name);
    formData.append('last_name',this.profileForm.value.lastname);
    formData.append('user_address',this.profileForm.value.address);
    formData.append('user_gender',this.profileForm.value.gender);
    formData.append('mobile_no',this.profileForm.value.mobilenumber);
    formData.append('user_dob',this.profileForm.value.datebirth);
    formData.append('my_bio',this.profileForm.value.myBio);
    formData.append('select_country',this.profileForm.value.country);
    formData.append('select_state',this.profileForm.value.state);

    this.util.presentLoading();
    this.user.saveProfile(formData).subscribe((resp) => {
      let response :any = resp;
      this.util.dismissLoading();
      if(response.status){
        this.storage.set('userData', JSON.stringify(response.all_activities))
        this.util.presentToast(this.ProfileEditedSuccessfully);
        this.fromSignUp?this.navCtrl.setRoot('MenuPage'):this.viewCtrl.dismiss();
      }else {
        this.util.presentToast(response.message);
      }
    }, (err) => {
      this.util.dismissLoading();
    });
  }

  setProfileFormData() {
    this.profileForm = this.formBuilder.group(
      {
        name: new FormControl("", Validators.compose([Validators.required])),
        lastname: new FormControl("", Validators.compose([Validators.required])),
        address: new FormControl("", Validators.compose([Validators.required])),
        country: new FormControl(""),
        state: new FormControl(""),
        myBio: new FormControl(""),
        datebirth: new FormControl("", Validators.compose([Validators.required])),
        gender: new FormControl("", Validators.compose([Validators.required])),
        mobilenumber: new FormControl("", Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(12)])
        ),
      },
    );
  }

  populateData() {
    if(this.userData.user_profile && this.userData.user_profile != ''){
      this.userImage = this.userData.user_profile;
    }else {
      this.userImage = 'assets/img/profile-default.jpeg';
    }
    this.profileForm.controls.name.setValue(this.userData.first_name);
    this.profileForm.controls.lastname.setValue(this.userData.last_name);
    this.profileForm.controls.address.setValue(this.userData.user_address);
    if (this.userData.user_dob && this.userData.user_dob === '0000-00-00'){
      this.userData.user_dob = '2020-01-01'
    }
    this.profileForm.controls.datebirth.setValue(this.userData.user_dob);
    if(this.userData.user_gender == ''){
      this.userData.user_gender = 'male'
    }
    this.profileForm.controls.gender.setValue(this.userData.user_gender);
    this.profileForm.controls.mobilenumber.setValue(this.userData.mobile_no);
    this.profileForm.controls.myBio.setValue(this.userData.my_bio);

    this.userData.select_country === '' ? this.profileForm.controls.country.setValue('default') : this.profileForm.controls.country.setValue(this.userData.select_country);
    this.userData.select_state === '' ? this.profileForm.controls.state.setValue('default') : this.profileForm.controls.state.setValue(this.userData.select_state);

  }

  getCountryList() {
    this.user.getCountryList().subscribe((resp) => {
      let response : any = resp;
      this.countryList = response.data;
    }, (err) => {
      console.error('ERROR :', err);
    });
  }
  getStateList(countryId) {
    this.user.getStateList({country_id:countryId}).subscribe((resp) => {
      let response : any = resp;
      this.stateList = response.data;
    }, (err) => {
      console.error('ERROR :', err);
    });
  }

  selectCountry() {
    let country = document.getElementById('country');
    let val = country['options'][country['selectedIndex']].text;
    this.profileForm.controls.country.setValue(val);
    let selectedCountryId = 1;
    this.countryList.filter(item => {
      if(val == item.name){
        selectedCountryId = item.id;
      }
    })
    this.getStateList(selectedCountryId);
  }
  selectState() {
    let state = document.getElementById('state');
    this.profileForm.controls.state.setValue( state['options'][state['selectedIndex']].text);
  }

  skip() {
    this.navCtrl.setRoot('MenuPage');
  }
}
