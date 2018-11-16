import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginProvider } from '../../providers/login/loginAuth'
import { LoginPage } from '../login/login';
import firebase from 'firebase';
import { LoadingController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-leave',
  templateUrl: 'leave.html',
})

export class LeavePage {
  @ViewChild('fileInput') fileInput;
  show: boolean = false;
  tab_show = true;
  show_type_of_leave = false;
  gaming = 'am'
  showleave = false;
  show_datepickder = false;
  type_of_leave = ['Annual', 'Time of in lieu', 'Medical', 'Maternity', 'Compassionate']
  public base64Image: string;
  form_leave: FormGroup;
  leavetype = new FormControl('', Validators.required);
  fromdate = new FormControl('', Validators.required);
  todate = new FormControl('', Validators.required);
  remark = new FormControl('', Validators.required);
  attachment = new FormControl('');
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private camera: Camera,
    public loginService: LoginProvider,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.menuCtrl.enable(true, 'myMenu');
    this.form_leave = this.formBuilder.group({
      leavetype: this.leavetype,
      fromdate: this.fromdate,
      todate: this.todate,
      remark: this.remark,
      attachment: this.attachment
    })
  }
  takePhoto(sourceType) {
    const options: CameraOptions = {
      quality: 90,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType
    }

    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.form_leave.patchValue({ image: imageData })
    }, (err) => {
      // Handle error
    });
  }
  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select photo',
      buttons: [
        {
          text: 'Select from a album',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY)
          }
        }, {
          text: 'Text a picture',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.CAMERA)
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  getProfileImageStyle() {
    return 'url(' + this.base64Image + ')'
  }
  async logForm() {
    // console.log(this.form_leave.value);
    if (this.base64Image) {
      await this.uploadImage();
      await console.log(this.form_leave.value);
    }
  }
  uploadImage() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading Please Wait...'
    });
    loading.present();
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`images/${filename}.jpg`);
    return imageRef.putString(this.base64Image, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      snapshot.ref.getDownloadURL().then((url) => {
        this.form_leave.patchValue({ attachment: url })
        console.log(this.form_leave.value);
        loading.dismiss();
      })
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LeavePage');
  }

  // async canEnter() {
  //   let check = await this.loginService.auth();
  //   if (!check) {
  //     console.log(this.loginService.auth());

  //     this.navCtrl.setRoot(LoginPage);
  //   }
  //   console.log(this.loginService.auth());

  // }
}
