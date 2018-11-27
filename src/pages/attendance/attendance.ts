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
  attedance_report_percen = {
    ontime: '0',
    onleave: '0',
    late: '0',
    verylate: '0',
    absent: '0'
  }
  attedance_report_count = {
    ontime: 0,
    onleave: 0,
    late: 0,
    verylate: 0,
    absent: 0
  }
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
          status: this.LeaveProvider.checkApplyLeave(new Date(element.attendance_date)) ? 'onleave' : this.status[element.attendance_status],
          checkin: element.scan_in_time !== null ? moment('2018-11-11 ' + element.scan_in_time).format('LTS') : null,
          checkout: element.scan_out_time !== null ? moment('2018-11-11 ' + element.scan_out_time).format('LTS') : null
        })
      })
      console.log(this.myAttendace);
      this.reportAttendance();
    })
    // this.myAttendace=[]
    // this.myAttendace.push({
    //   date: moment('11/20/2018').format('YYYY/MM/DD'),
    //   status: 'ontime',
    //   checkin: moment('2018-11-11 ' + '08:00:00').format('LTS'),
    //   checkout: moment('2018-11-11 ' + '17:00:00').format('LTS')
    // })
    // this.myAttendace.push({
    //   date: moment('11/21/2018').format('YYYY/MM/DD'),
    //   status: 'late',
    //   checkin: moment('2018-11-11 ' + '08:00:00').format('LTS'),
    //   checkout: moment('2018-11-11 ' + '17:00:00').format('LTS')
    // })
    // this.myAttendace.push({
    //   date: moment('11/22/2018').format('YYYY/MM/DD'),
    //   status: 'verylate',
    //   checkin: moment('2018-11-11 ' + '08:00:00').format('LTS'),
    //   checkout: moment('2018-11-11 ' + '17:00:00').format('LTS')
    // })
    // this.myAttendace.push({
    //   date: moment('11/23/2018').format('YYYY/MM/DD'),
    //   status: 'absent',
    //   checkin: moment('2018-11-11 ' + '08:00:00').format('LTS'),
    //   checkout: moment('2018-11-11 ' + '17:00:00').format('LTS')
    // })
    // this.myAttendace.push({
    //   date: moment('11/24/2018').format('YYYY/MM/DD'),
    //   status: 'onleave',
    //   checkin: moment('2018-11-11 ' + '08:00:00').format('LTS'),
    //   checkout: moment('2018-11-11 ' + '17:00:00').format('LTS')
    // })
    // this.reportAttendance()
  }
  reportAttendance() {

    if (this.myAttendace.length > 0) {
      let onleave = 0;
      let ontime = 0;
      let late = 0;
      let verylate = 0;
      let absent = 0;
      this.myAttendace.forEach(element => {
        if (element.status === 'absent') absent++;
        else if (element.status === 'ontime') ontime++;
        else if (element.status === 'late') late++;
        else if (element.status === 'verylate') verylate++;
        else if (element.status === 'onleave') onleave++;
      })
      let total = this.myAttendace.length;
      this.attedance_report_count.absent = absent;
      this.attedance_report_count.onleave = onleave;
      this.attedance_report_count.ontime = ontime;
      this.attedance_report_count.late = late;
      this.attedance_report_count.verylate = verylate;
      this.attedance_report_percen.late = (Math.round(late * 100) / total).toFixed(2);
      this.attedance_report_percen.absent = (Math.round(absent * 100) / total).toFixed(2);
      this.attedance_report_percen.verylate = (Math.round(verylate * 100) / total).toFixed(2);
      this.attedance_report_percen.onleave = (Math.round(onleave * 100) / total).toFixed(2);
      this.attedance_report_percen.ontime = (Math.round(ontime * 100) / total).toFixed(2);
      console.log(this.attedance_report_percen);
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AttendancePage');
  }

}
