import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { Camera } from '@ionic-native/camera';

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
  isRemark:boolean = false;
  isAttachment:boolean = false;
  show: boolean = false;
  tab_show = true;
  show_type_of_leave = false;
  show_type_of_claim = false;
  gaming = 'am'
  showleave = false;
  type_of_leave = ['Entertainment', 'Medical', 'Traveling', 'Miscellaneous']
  public base64Image: string;
  form: FormGroup;
  fromdate='2018-12-20'
  toDate = '2018-12-29'
  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController,private camera: Camera) {
  	this.menuCtrl.enable(true,'myMenu');
  }
  showRemark(){
    if(this.isRemark == true){
      return this.isRemark = false;
    }
    this.isRemark = true;
  }
  showAttachment(){
    if(this.isAttachment == true){
      return this.isAttachment = false;
    }
    this.isAttachment = true;
  }
  takePicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000
      }).then((data) => {
        this.base64Image = 'data:image/jpg;base64,' + data
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }
  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimPage');
  }

}
