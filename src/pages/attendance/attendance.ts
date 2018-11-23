import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import {
  trigger,
  style,
  transition,
  animate
} from "@angular/animations";
import { AttendaceProvider } from '../../providers/attendace/attendace';
import { Attendance } from '../../Model/Attendance';
import { elementAt } from 'rxjs/operator/elementAt';
import moment from 'moment-timezone';
import { ScrollHideConfig } from '../../providers/const/scroll-hide';
import { ApplyleaveProvider } from '../../providers/applyleave/applyleave';

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
  myAtttendace: Attendance[] = []
  status = ['absent', 'ontime', 'late', 'verylate', 'onleave']
  myAttendace = [];
  myAttendace1 = []
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  calendar = {
    mode: "month",
    currentDate: new Date()
  };
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private AttendanceProvider: AttendaceProvider,
    private LeaveProvider: ApplyleaveProvider
  ) {
    this.menuCtrl.enable(true, 'myMenu');
    this.AttendanceProvider.getAttendence(new Date().getMonth(), new Date().getFullYear())
    this.buildData();
  }
  onMonthSelect(event) {
    console.log(event);
    this.AttendanceProvider.getAttendence(event.month, event.year);
    this.buildData()
  }
  buildData() {
    this.LeaveProvider.getAllMyApply();
    this.AttendanceProvider.myAttendace.subscribe(data => {
      this.myAttendace = [];
      data.forEach(element => {
        this.myAttendace.push({
          date: moment(element.attendance_date).format('YYYY/MM/DD'),
          status: this.LeaveProvider.checkApplyLeave(new Date(element.attendance_date))?'onleave': this.status[element.attendance_status],
          checkin: element.scan_in_time !== null ? moment('2018-11-11 ' + element.scan_in_time).format('LTS') : null,
          checkout: element.scan_out_time !== null ? moment('2018-11-11 ' + element.scan_out_time).format('LTS') : null
        })
      })
      console.log(this.myAttendace);
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AttendancePage');
  }

}
