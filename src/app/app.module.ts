import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { AttendancePage } from '../pages/attendance/attendance';
import { CheckinPage } from '../pages/checkin/checkin';
import { LeavePage } from '../pages/leave/leave';
import { ClaimPage } from '../pages/claim/claim';
import { CalendarModule } from '../calendar/calendar.module'
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { LoginProvider } from '../providers/login/loginAuth';
import { HttpModule } from '@angular/http'; 

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ProfilePage,
    AttendancePage,
    CheckinPage,
    LeavePage,
    ClaimPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    BrowserAnimationsModule,
    NgCircleProgressModule.forRoot({}),
    CalendarModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ProfilePage,
    AttendancePage,
    CheckinPage,
    LeavePage,
    ClaimPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule { }

