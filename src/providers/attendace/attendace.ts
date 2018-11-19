import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Attendance } from '../../Model/Attendance';
import { Storage } from '@ionic/storage';
import { api } from '../const/const';

/*
  Generated class for the AttendaceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AttendaceProvider {
  private _myAttendance: BehaviorSubject<Attendance[]>
  constructor(public http: HttpClient,
    private storage: Storage,
  ) {
    this.dataStore = { myattendace: [] }
    this._myAttendance = new BehaviorSubject<Attendance[]>([])
  }
  private dataStore: {
    myattendace: Attendance[]
  }
  get myAttendace(): Observable<Attendance[]> {
    return this._myAttendance.asObservable()
  }
  getAttendence(month, year) {
    if (new Date().getMonth() - month > 2) return
    month = month + 1;
    const url = api + `/personal-attendance?month=${month}&year=${year}`;
    const parram = new HttpParams().set('month', month + 1).set('year', year)
    this.storage.get('token').then(data => {
      if (data != null) {
        let header = new HttpHeaders().set("Authorization", "Bearer " + data);
        return this.http.get(url, { headers: header })
          .subscribe(data => {
            console.log(data);
            
            let myattendace: Attendance[] = []
            let attendance = data['data']
            if (attendance === undefined) return;
            attendance.forEach(element => {
              myattendace.push({
                attendance_date: element.attendance_date,
                scan_in_time: element.scan_in_time,
                scan_out_time: element.scan_out_time,
                attendance_status: element.attendance_status,
              })
            });
            this.dataStore.myattendace = myattendace;
            
            this._myAttendance.next(Object.assign({}, this.dataStore).myattendace);
          }, error => {
            console.log('thang' + error.error);

          })
      }
    })
  }


}
