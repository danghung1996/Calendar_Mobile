import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { api } from '../const/const';
import { AlertController } from 'ionic-angular';
import { Claim } from '../../Model/Claim';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import moment from 'moment-timezone';

/*
  Generated class for the ClaimsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ClaimsProvider {
  private _myClaim: BehaviorSubject<Claim[]>;
  constructor(public http: HttpClient,
    private storage: Storage,
    public alertCtrl: AlertController
  ) {
    console.log('Hello ClaimsProvider Provider');
    this.dataStore = { myclaim: [] }
    this._myClaim = new BehaviorSubject<Claim[]>([]);
    this.getAllClaims()
  }
  private dataStore: {
    myclaim: Claim[]
  }
  get myClaim(): Observable<Claim[]> {
    return this._myClaim.asObservable()
  }
  myformPost(myclaim, loading, reset, form) {
    console.log(myclaim);

    this.storage.get('token').then(data => {
      if (data != null) {
        let header = new HttpHeaders().set("Authorization", "Bearer " + data);
        return this.http.post(api + '/myclaim', myclaim
          , { headers: header }).subscribe(res => {
            this.showAlert('Notification', 'Applied Claim Successfully')
            this.getAllClaims()
            loading.dismiss()
            reset(form);
            return true;
          }, error => {
            if (error['error']['success'] === false) this.showAlert('Notification', 'Unable to apply claim')
            else this.showAlert('Notification', 'Error ! Try Again')
            loading.dismiss()
            return false;
          })
      }
    })
  }
  getAllClaims() {
    let myclaim: Claim[] = [];
    this.storage.get('token').then(data => {
      if (data != null) {
        let header = new HttpHeaders().set("Authorization", "Bearer " + data);
        return this.http.get(api + '/myclaim', { headers: header }).subscribe(res => {
          let data: Claim[] = res['data'];
          data.forEach(element => {
            myclaim.push({
              application_date: element.application_date,
              amount: element.amount,
              remarks: element.remarks,
              claim_type: element.claim_type,
              image:  element.image,
              created_at : moment(element.created_at).format('MMM Do'),
              show:false
            })
          })
          this.dataStore.myclaim = myclaim.reverse();
          this._myClaim.next(Object.assign({}, this.dataStore).myclaim)
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
