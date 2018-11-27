import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform, LoadingController } from 'ionic-angular';
import moment from 'moment';
import { Geolocation } from '@ionic-native/geolocation';
import { CheckInProvider } from '../../providers/check-in/check-in'
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CheckinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkin',
  templateUrl: 'checkin.html',
})
export class CheckinPage {
  currentDate: Date = new Date();
  now: any;
  currentTime: any;
  timeCheckin: any;
  timeCheckin1: any;
  totalWorkHour: any;
  timecheckOut: any;
  long: any;
  lat: any;
  checkInStatus: string = ""
  isCheckIn: boolean = true;
  isCheckOut: boolean = false;
  isCheckInStart: boolean = true;
  isCheckInConfirm: boolean = false;
  isCheckInSuccess: boolean = false;
  isCheckOutStart: boolean = false;
  isCheckOutConfirm: boolean = false;
  isCheckOutSuccess: boolean = false;
  remarks: string = "";
  isError: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public platForm: Platform,
    private location: Geolocation,
    private checkInService: CheckInProvider,
    public storage: Storage,
    public loadingCtrl: LoadingController,
  ) {
    this.platForm.ready().then(() => {
      this.location.getCurrentPosition().then(res => {
        this.lat = parseFloat(res.coords.latitude.toString()).toFixed(5);
        this.long = parseFloat(res.coords.longitude.toString()).toFixed(5);
      }).catch(() => {
        console.log("Error:")
      })
    })
    
    setInterval(() => {
      this.currentTime = moment(new Date).format('h:mm:ss a');
    }, 1);


    this.getCheckInTime();
    if (this.timeCheckin1 !== null || this.timeCheckin1 !== undefined) {
      // setInterval(() => {
      //   console.log("hello");
      //   var currentDate = moment(new Date()).format("HH:mm:ss")
      //   this.totalWorkHour = moment.utc(moment(currentDate, "HH:mm:ss").diff(moment(this.timeCheckin1, "HH:mm"))).format("HH:mm");
      // }, 1)
    }
    this.checkCheckIn();
    this.checkCheckOut();
  }

  ionViewDidLoad() {
    const loader = this.loadingCtrl.create({
      content: "Waiting",
      duration: 2000
    });
    loader.present();
    this.now = moment(new Date).format("Do MMM YY")
  }

  async getDataCheckOut() {
    await this.storage.get("remarksCheckOut").then(data => {
      this.remarks = data;
    })
    await this.storage.get("timeCheckOut").then(data => {
      this.timecheckOut = data;
    })
  }

  statusCheckIn(): string {
    var onTime = "08:00:00";
    var late = "08:30:00";
    // var veryLate = "09:00:00";
    if ((moment(this.currentDate, "HH:mm:ss")).isBefore(moment(onTime, "HH:mm:ss"))) {
      return "On Time"
    } else if ((moment(this.currentDate, "HH:mm:ss")).isBefore(moment(late, "HH:mm:ss"))
      && (moment(this.currentDate, "HH:mm:ss")).isAfter(moment(onTime, "HH:mm:ss"))) {
      return "Late"
    } else {
      return "Very Late"
    }
  }


  mobileCheckin() {
    this.isCheckInStart = false;
    this.isCheckInConfirm = true;
    this.timeCheckin = this.currentTime

  }

  confirmCheckIn() {
    this.isCheckInConfirm = false;
    this.isCheckInSuccess = true;
    if (this.lat === null && this.long === null) {
      this.location.getCurrentPosition().then(res => {
        this.lat = parseFloat(res.coords.latitude.toString()).toFixed(5);
        this.long = parseFloat(res.coords.longitude.toString()).toFixed(5);
      }).catch(() => {
        console.log("Error:")
      })
    }
    var location = this.lat + "," + this.long;
    this.checkInStatus = this.statusCheckIn()
    this.timeCheckin = this.currentTime
    this.checkInService.checkIn(location, this.remarks)
  }

  checkCheckIn() {
    this.checkInService.isCheckIn();
    this.checkInService.isCheckInAlready.subscribe(data => {
      if (data['message'] === 'Checked in') {
        this.isCheckIn = false;
        this.isCheckOut = true;
        this.isCheckOutStart = true;
        this.getCheckInTime();
      }
    })
  }
  async getCheckInTime() {
    await this.storage.get("timeCheckIn").then(data => {
      this.timeCheckin1 = data;
    })
  }
  checkCheckOut() {
    this.checkInService.isCheckOut();
    this.checkInService.isCheckOutAlready.subscribe(data => {
      if (data['message'] === 'Checked out') {
        this.isCheckIn = false;
        this.isCheckOut = true;
        this.isCheckOutStart = false;
        this.isCheckOutConfirm = false;
        this.isCheckOutSuccess = true;
        this.getDataCheckOut();
      }
    })
  }
  confirmCheckOut() {
    this.isCheckOutConfirm = false;
    this.isCheckOutSuccess = true;
    if (this.lat === null && this.long === null) {
      this.location.getCurrentPosition().then(res => {
        this.lat = parseFloat(res.coords.latitude.toString()).toFixed(5);
        this.long = parseFloat(res.coords.longitude.toString()).toFixed(5);
      }).catch(() => {
        console.log("Error:")
      })
    }
    var location = this.lat + "," + this.long;
    this.timecheckOut = this.currentTime
    this.checkInService.checkOut(location, this.remarks)

  }
  checkInSuccess() {
    this.isCheckIn = false
    this.isCheckOut = true;
    this.isCheckOutStart = true;
  }
  cancel() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
  mobileCheckOut() {
    this.isCheckOutStart = false;
    this.isCheckOutConfirm = true;
    this.timecheckOut = this.currentTime
  }
}
