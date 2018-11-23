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
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProfileProvider } from '../providers/profile/ProfileSerivce';
import { HttpClientProvider } from '../providers/http-client/http-client';
import { AuthInterceptor } from '../providers/auth-interceptor/auth-interceptor';
import { ApplyleaveProvider } from '../providers/applyleave/applyleave';
import { EventProvider } from '../providers/event/event';
import { AttendaceProvider } from '../providers/attendace/attendace';
import { CheckInProvider } from '../providers/check-in/check-in';
import { ScrollHideDirective } from '../providers/const/scroll-hide';

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
    ScrollHideDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    BrowserAnimationsModule,
    NgCircleProgressModule.forRoot({}),
    CalendarModule,
    IonicStorageModule.forRoot()
    
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
    ProfileProvider,
    HttpClientProvider,
    ApplyleaveProvider,
    EventProvider,
    AttendaceProvider,
    CheckInProvider,
  ]
})
export class AppModule { }

