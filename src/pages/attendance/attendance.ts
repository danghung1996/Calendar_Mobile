import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import {
  trigger,
  style,
  transition,
  animate
} from "@angular/animations";
/**
 * Generated class for the AttendancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html',
  animations: [
    trigger("enterAnimation", [
      transition(":enter", [
        style({ transform: "translateX(100%)", opacity: 0 }),
        animate("300ms", style({ transform: "translateX(0)", opacity: 1 }))
      ]),
      transition(":leave", [
        style({ transform: "translateX(0)", opacity: 1 }),
        animate("300ms", style({ transform: "translateX(100%)", opacity: 0 }))
      ])
    ])
  ]
})
export class AttendancePage {
  showColorCode: boolean = false;
  showAtenden: boolean = false;
  showAtendenRP: boolean = false;
  fakeData = [{}];
  currentEvents = [
    {
      year: 2018,
      month: 11,
      date: 25
    },
    {
      year: 2018,
      month: 11,
      date: 26
    }
  ];
  status = [
    { date: '2018/11/20', status: 'late', checkin: '08:00:00 AM', checkout: '14:00:00 PM' },
    { date: '2018/11/22', status: 'late', checkin: '08:00:00 AM', checkout: '14:00:00 PM' },
    { date: '2018/11/21', status: 'ontime', checkin: '08:00:00 AM', checkout: '14:00:00 PM' },
    { date: '2018/12/20', status: 'ontime', checkin: '08:00:00 AM', checkout: '14:00:00 PM' },
    { date: '2018/12/21', status: 'ontime', checkin: '08:00:00 AM', checkout: '14:00:00 PM' },
    { date: '2018/12/22', status: 'ontime', checkin: '08:00:00 AM', checkout: '14:00:00 PM' },
  ];
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  calendar = {
    mode: "month",
    currentDate: new Date()
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController) {
    this.menuCtrl.enable(true, 'myMenu');
  }
  onMonthSelect(event) {
    console.log(event);

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AttendancePage');
  }

}
