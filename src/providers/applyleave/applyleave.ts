import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginProvider } from '../login/loginAuth';
import { Storage } from '@ionic/storage';
import { api } from '../const/const';
import { AlertController } from 'ionic-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApplyLeave } from '../../Model/ApplyLeave';
import { Jsonp } from '@angular/http';
import moment from 'moment-timezone';


/*
  Generated class for the ApplyleaveProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApplyleaveProvider {

  private _myLeaves: BehaviorSubject<ApplyLeave[]>;
  constructor(public http: HttpClient,
    private loginProvider: LoginProvider,
    private storage: Storage,
    public alertCtrl: AlertController
  ) {
    this.dataStore = { myleaves: [] }
    this._myLeaves = new BehaviorSubject<ApplyLeave[]>([]);
    this.getAllMyApply();
  }
  private dataStore: {
    myleaves: ApplyLeave[]
  }
  get myLeaves(): Observable<ApplyLeave[]> {
    return this._myLeaves.asObservable()
  }
  myformPost(leaverequest, loading) {
    console.log(JSON.stringify(leaverequest));
    
    this.storage.get('token').then(data => {
      if (data != null) {
        let header = new HttpHeaders().set("Authorization", "Bearer " + data);
        return this.http.post(api + '/employee-leave', leaverequest
          , { headers: header }).subscribe(res => {
            this.showAlert('Notification', 'Applied Leave Request Successfully')
            this.getAllMyApply()
            loading.dismiss()
          }, error => {
            this.showAlert('Notification', 'Error')
            loading.dismiss()
          })
      }
    })
  }
  getAllMyApply() {
    const url = api + '/my-leave';
    let myleaves: ApplyLeave[] = []
    this.storage.get('token').then(data => {
      if (data != null) {
        let header = new HttpHeaders().set("Authorization", "Bearer " + data);
        return this.http.get(url, { headers: header }).subscribe(res => {
          let data: ApplyLeave[] = res['data'];
          data.forEach(element => {
            myleaves.push(
              {
                date_applied: element.date_applied,
                leave_type: element.leave_type,
                leave_from_date: element.leave_from_date,
                leave_to_date: element.leave_to_date,
                leave_status: element.leave_status,
                image: element.image,
                created_at: moment(element.created_at).format('MMM Do'),
                show:false
              }
            )
          })
          this.dataStore.myleaves = myleaves.reverse();
          this._myLeaves.next(Object.assign({}, this.dataStore).myleaves);
        },error=>{
          console.log(error);         
        })
      }
    })
  }
  showAlert(title, content) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: ['OK']
    });
    alert.present();
  }


}
