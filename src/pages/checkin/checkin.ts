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
  timeCheckinInDB: any;
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
    //get location lat and long
    this.platForm.ready().then(() => {
      this.location.getCurrentPosition().then(res => {
        this.lat = parseFloat(res.coords.latitude.toString()).toFixed(5);
        this.long = parseFloat(res.coords.longitude.toString()).toFixed(5);
      }).catch(() => {
        console.log("Error:")
      })
    })
    
    //get real-time
    setInterval(() => {
      this.currentTime = moment(new Date).format('h:mm:ss A');
      if(this.timeCheckinInDB !== null || this.timeCheckinInDB !== undefined){
        var currentDate = moment(new Date()).format("HH:mm:ss")
        this.totalWorkHour = moment.utc(moment(currentDate, "HH:mm:ss").diff(moment(this.timeCheckinInDB, "HH:mm"))).format("HH:mm");
      }
    }, 1000);
    // check is check-in
    this.checkCheckIn();
    // check is check-out
    this.checkCheckOut();
  }

  ionViewDidLoad() {
    //loader when start
    const loader = this.loadingCtrl.create({
      content: "Waiting",
      duration: 2000
    });
    loader.present();
    this.now = moment(new Date).format("Do MMM YY")
  }

  //Statsu of check-in
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

  // button Mobile check-in
  mobileCheckin() {
    this.isCheckInStart = false;
    this.isCheckInConfirm = true;
    this.timeCheckin = this.currentTime

  }
  // click confirm check-in
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
  // check is check in
  checkCheckIn() {
    this.checkInService.isCheckIn();
    this.checkInService.isCheckInAlready.subscribe(data => {
      if (data['message'] === 'Checked in') {
        this.timeCheckinInDB = data['check_in_data'][0].scan_in_time;
        this.isCheckIn = false;
        this.isCheckOut = true;
        this.isCheckOutStart = true;
      }
    })
  }
  // check is check-out
  checkCheckOut() {
    this.checkInService.isCheckOut();
    this.checkInService.isCheckOutAlready.subscribe(data => {
      if (data['message'] === 'Checked out') {
        this.timecheckOut = this.tConvert(data['check_out_data'][0].scan_out_time);
        this.remarks = data['check_out_data'][0].scan_out_remarks;
        this.isCheckIn = false;
        this.isCheckOut = true;
        this.isCheckOutStart = false;
        this.isCheckOutConfirm = false;
        this.isCheckOutSuccess = true;
      }
    })
  }
  //convert time from Server
   tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM ' : ' PM '; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
  //click mobile check in
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
  //click confirm check-in
  checkInSuccess() {
    this.isCheckIn = false
    this.isCheckOut = true;
    this.isCheckOutStart = true;
  }
  //click cancel button
  cancel() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
  //click mobile check out
  mobileCheckOut() {
    this.isCheckOutStart = false;
    this.isCheckOutConfirm = true;
    this.timecheckOut = this.currentTime
  }
}
