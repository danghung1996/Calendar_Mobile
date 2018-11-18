import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { AttendancePage } from '../pages/attendance/attendance';
import { CheckinPage } from '../pages/checkin/checkin';
import { LeavePage } from '../pages/leave/leave';
import { ClaimPage } from '../pages/claim/claim';
import { Storage } from '@ionic/storage';
import { LoginProvider } from '../providers/login/loginAuth';
import firebase from 'firebase';
import { ProfileProvider } from '../providers/profile/ProfileSerivce'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  employeeName: string = ""
  pages: Array<{ icon: string, title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    private _auth: LoginProvider,
    public toastCtrl: ToastController,
    private _profileService: ProfileProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { icon: 'people', title: 'Profile', component: ProfilePage },
      { icon: 'planet', title: 'Attendance', component: AttendancePage },
      { icon: 'podium', title: 'Checkin', component: CheckinPage },
      { icon: 'power', title: 'Leave', component: LeavePage },
      { icon: 'radio', title: 'Claim', component: ClaimPage },
      { icon: 'redo', title: 'Logout', component: LoginPage },
    ];
    this.getDataProfile();
  }
  getDataProfile(){
    this._profileService.getUserProfile();
    this._profileService.getProfile.subscribe(data => {
      this.employeeName = data['employee_name']
    })
  }
  authLogin() {
    const toast = this.toastCtrl.create({
      message: 'Re-try login',
      duration: 1500,
      cssClass: 'success',
      position: 'top'
    });
    toast.present();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      const firebaseConfig = {
        apiKey: "AIzaSyBl8RwUv3M1ItwoO-0tPktUcUxi9swmLSI",
        authDomain: "calendarmobile-b223c.firebaseapp.com",
        databaseURL: "https://calendarmobile-b223c.firebaseio.com",
        projectId: "calendarmobile-b223c",
        storageBucket: "calendarmobile-b223c.appspot.com",
        messagingSenderId: "970963003093"
      };
      firebase.initializeApp(firebaseConfig);
    });
  }
  openPage(page) {

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title === 'Logout') {
      this.storage.remove("token");
    }

    this._auth.tokenAuth().then(data => {
      if (!data) {
        this.authLogin();
        // this.nav.setRoot(page.component)
        this.nav.setRoot(LoginPage);
      } else {
        this.nav.setRoot(page.component);
      }
    })
  }
}
