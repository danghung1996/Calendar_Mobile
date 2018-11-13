import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform } from 'ionic-angular';
import moment from 'moment';
import {Geolocation} from '@ionic-native/geolocation'


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
  currentTime: any;
  timeCheckin: any;
  long: any;
  lat: any;
  isCheckIn:boolean = true;
  isCheckOut:boolean = false;
  isCheckInStart:boolean = true;
  isCheckInConfirm:boolean = false;
  isCheckInSuccess:boolean = false;
  isCheckOutStart:boolean = false;
  isCheckOutConfirm:boolean = false;
  isCheckOutSuccess:boolean = false;
  isError:boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public platForm: Platform,
    private location: Geolocation
  ) {
    this.platForm.ready().then(()=>{
      this.location.getCurrentPosition().then(res => {
        this.lat = parseFloat(res.coords.latitude.toString()).toFixed(5);
        this.long = parseFloat(res.coords.longitude.toString()).toFixed(5);
      }).catch(() => {
        console.log("Error:")
      })
    })

  setInterval(() => {
    this.currentDate = new Date();
    this.currentTime = moment(this.currentDate).format('h:mm:ss a');
  }, 1);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckinPage');
  }
  mobileCheckin(){
    this.isCheckInStart = false;
    this.isCheckInConfirm = true;
  }

  checked(){
    this.isCheckInConfirm = false;
    this.isCheckInSuccess = true;
  }
  confirmCheckOut(){
    this.isCheckOutConfirm = false;
    this.isCheckOutSuccess = true;
  }
  checkInSuccess(){
    this.isCheckIn = false
    this.isCheckOut = true;
    this.isCheckOutStart = true;
  }
  cancel(){
    // this.isCheckin = false;
  }
  mobileCheckOut(){
    this.isCheckOutStart = false;
    this.isCheckOutConfirm = true;
  }

}
