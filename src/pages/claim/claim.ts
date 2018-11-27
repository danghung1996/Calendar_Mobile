import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import moment from 'moment-timezone';

/**
 * Generated class for the ClaimPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claim',
  templateUrl: 'claim.html',
})
export class ClaimPage {
  @ViewChild('fileInput') fileInput;
  isRemark: boolean = false;
  isAttachment: boolean = false;
  show: boolean = false;
  tab_show = true;
  show_type_of_leave = false;
  show_type_of_claim = false;
  gaming = 'am'
  showleave = false;
  type_of_claim = ['Entertainment', 'Medical', 'Traveling', 'Miscellaneous']
  public base64Image: string;
  form_claim: FormGroup;
  claimtypeFC = new FormControl('', Validators.required);
  amountFC = new FormControl('', Validators.required);
  remarkFC = new FormControl('', Validators.required);
  imageFC = new FormControl('');
  icon_status: string[] = [
    '../../assets/icon/m_pending.png',
    '../../assets/icon/m_onhold.png',
    '../../assets/icon/m_approve.png',
    '../../assets/icon/m_cancel.png',
    '../../assets/icon/m_decline.png'
  ]
  showClaim: boolean[] = [false, false, false, false]
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,    
    private formBuilder: FormBuilder
  ) {
    this.menuCtrl.enable(true, 'myMenu');
    this.form_claim = this.formBuilder.group({
      application_date: moment().format('YYYY-MM-DD'),
      claim_type: this.claimtypeFC,
      amount:this.amountFC,
      remarks:this.remarkFC
    })
  }
  
  showClaimInput(i: number) {
    if(this.showClaim[i]) {this.showClaim[i]= false;return;}
    this.showClaim.forEach((element, index) => {
      this.showClaim[index] = index === i
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
    }, (err) => {
      // Handle error
    });
  }
  uploadImage() {
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`images/${filename}.jpg`);
    return imageRef.putString(this.base64Image, firebase.storage.StringFormat.DATA_URL)
  }
  onClick() {
    if (!this.form_claim.valid) {
      this.showAlert();
      return;
    }
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading Please Wait...'
    });
    console.log(this.form_claim.value);
    
  }
  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Notification',
      subTitle: 'Check your leave request again !',
      buttons: ['OK']
    });
    alert.present();
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
          text: 'Take a picture',
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimPage');
  }

}
