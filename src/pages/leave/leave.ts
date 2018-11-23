import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ActionSheetController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginProvider } from '../../providers/login/loginAuth'
import { LoginPage } from '../login/login';
import firebase from 'firebase';
import { LoadingController } from 'ionic-angular';
import { ApplyleaveProvider } from '../../providers/applyleave/applyleave';
import { EventProvider } from '../../providers/event/event';
import moment from 'moment-timezone';
import { ApplyLeave } from '../../Model/ApplyLeave';
import { Observable } from 'rxjs';

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
  from_a = 'am'
  to_a = 'am'
  showleave = false;
  show_datepickder = false;
  isRemark: boolean = false;

  isAttachment: boolean = false;
  type_of_leave: string[] = ['Medical', 'Annual', 'Compassionate', 'Maternity', 'Pilgrimage', 'Prolong Illness']
  status_leave: string[] = ['PENDING', 'ON HOLD', 'APPROVE', 'CANCEL', 'DECLINE']
  currentEvents = []
  todayEvents = ['No events']
  today = moment(new Date()).format('Do MMM YYYY')
  public base64Image: string;
  form_leave: FormGroup;
  myleave: Observable<ApplyLeave[]>
  leavetype = new FormControl('', Validators.required);
  fromdate = new FormControl('', Validators.required);
  todate = new FormControl('', Validators.required);
  remark = new FormControl('', Validators.required);
  image = new FormControl('');
  date_apply = new FormControl('0', Validators.required);
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private camera: Camera,
    public loginService: LoginProvider,
    public actionSheetCtrl: ActionSheetController,
    private applyleaveProvider: ApplyleaveProvider,
    private eventProvider: EventProvider,
    public alertCtrl: AlertController
  ) {
    this.menuCtrl.enable(true, 'myMenu');
    this.form_leave = this.formBuilder.group({
      leave_type: this.leavetype,
      leave_from_date: this.fromdate,
      leave_to_date: this.todate,
      leave_remarks: this.remark,
      image: this.image,
      date_applied: this.date_apply
    })
    this.applyleaveProvider.getAllMyApply();
    this.myleave = this.applyleaveProvider.myLeaves;
    this.getEvent()

  }
  onDaySelect(event) {
    if (event.events !== undefined) {
      this.todayEvents = event.events;
      console.log(this.todayEvents);
    } else {
      this.todayEvents = ['No events']
    }

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
  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Notification',
      subTitle: 'Check your leave request again !',
      buttons: ['OK']
    });
    alert.present();
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
  resetForm() {
    this.show_type_of_leave = false;
    this.show_datepickder = false;
    this.isRemark = false;
    this.isAttachment = false;
    this.base64Image = '';
    this.tab_show = false
  }
  async logForm() {
    if (!this.form_leave.valid) {
      this.showAlert();
      return;
    }
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading Please Wait...'
    });
    loading.present();
    
    if (this.base64Image) {
      await this.uploadImage().then((snapshot) => {
        snapshot.ref.getDownloadURL().then((url) => {
          this.image.setValue(url);
          var leaverequest = this.buildData();
          this.applyleaveProvider.myformPost(leaverequest, loading);
          this.resetForm();
        })
      });
    } else {
      var leaverequest = this.buildData();
      this.applyleaveProvider.myformPost(leaverequest, loading)
      this.resetForm()
    }
  }
  buildData() {
    var data = new ApplyLeave();
    data.leave_type = this.leavetype.value
    data.leave_from_date = this.from_a === 'am' ? moment(this.fromdate.value).format('YYYY-MM-DD 00:mm:ss') : moment(new Date(this.fromdate.value).setHours(12, 0, 0)).format('YYYY-MM-DD 12:mm:ss')
    data.leave_to_date = this.to_a === 'am' ? moment(this.todate.value).format('YYYY-MM-DD 00:mm:ss') : moment(new Date(this.todate.value).setHours(12, 0, 0)).format('YYYY-MM-DD 12:mm:ss')
    data.leave_remarks = this.remark.value
    data.image = this.image.value !== '' ? this.image.value : null
    data.date_applied = this.date_apply.value
    return data;
  }
  uploadImage() {

    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`images/${filename}.jpg`);
    return imageRef.putString(this.base64Image, firebase.storage.StringFormat.DATA_URL)
  }
  countDateApply() {

    if (this.fromdate.valid && this.todate.valid) {
      let daysOfleave = []
      let dayapplied = 0;
      let days: Date[]
      this.eventProvider.eventNonworkingDetail.subscribe(data => {
        days = data;
        daysOfleave = []
        for (let day = new Date(this.fromdate.value); day <= new Date(this.todate.value); day.setDate(day.getDate() + 1)) {
          daysOfleave.push({ date: new Date(day), active: true, value: 1 })
        }
        console.log(daysOfleave);

        if (days.length > 0) {
          days = days.filter(x => {
            return (moment(x) >= moment(this.fromdate.value) && moment(x) <= moment(this.todate.value));
          })
          console.log(days);

          days.forEach(element => {
            let find_day = daysOfleave.findIndex(x => { return moment(x.date) === moment(element) })
            daysOfleave[find_day].active = false;
          });
        }
        if (this.from_a === 'pm') daysOfleave[0].value = 0.5;
        if (this.to_a === 'am') daysOfleave[daysOfleave.length - 1].value = 0.5;
        daysOfleave.forEach(element => {
          if (element.active) {
            dayapplied += element.value
          }
        })
        this.date_apply.setValue(dayapplied)
      })
    }
  }
  getEvent() {
    this.eventProvider.allEvent.subscribe(data => {
      this.currentEvents = []
      data.forEach(element => {
        this.currentEvents.push({
          year: element.date.getFullYear(),
          month: element.date.getMonth(),
          date: element.date.getDate(),
          events: element.events
        })
      })
    })
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
