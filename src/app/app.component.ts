import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
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
import { LoginProvider } from '../providers/login/loginAuth'
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ icon: string, title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    private _auth: LoginProvider) {
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

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  isLoginAlready() {

  }

  openPage(page) {

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title === 'Logout') {
      this.storage.remove("token");
    }

    this._auth.auth().then(data => {
      if (!data) {
        this.nav.setRoot(LoginPage);
      } else {
        this.nav.setRoot(page.component);
      }
    })
  }
}
