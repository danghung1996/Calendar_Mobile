import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ActionSheetController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
  form: FormGroup;
  claimtypeFC = new FormControl('', Validators.required);
  amountFC = new FormControl('', Validators.required);
  remarkFC = new FormControl('', Validators.required);
  imageFC = new FormControl('');
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController
  ) {
    this.menuCtrl.enable(true, 'myMenu');
  }
  showRemark() {
    if (this.isRemark == true) {
      return this.isRemark = false;
    }
    this.isRemark = true;
  }
  showAttachment() {
    if (this.isAttachment == true) {
      return this.isAttachment = false;
    }
    this.isAttachment = true;
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
  presentActionSheet1() {
    console.log('thangnvs')
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimPage');
  }

}
