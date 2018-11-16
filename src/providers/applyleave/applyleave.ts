import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginProvider } from '../login/loginAuth';
import { Storage } from '@ionic/storage';
import { api } from '../const/const';

/*
  Generated class for the ApplyleaveProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApplyleaveProvider {

  constructor(public http: HttpClient, private loginProvider: LoginProvider, private storage: Storage) {
    console.log('Hello ApplyleaveProvider Provider');
  }
  async myformPost(data) {
    let header
    await this.storage.get('token').then(data => {
      if (data != null) {
        header = new HttpHeaders().set("Authorization", "Bearer " + data);
      }
    })
    if (header !== null)
      return await this.http.post(api + '/employee-leave',
        {
          "leave_from_date": "2018-11-17 08:00:00",
          "leave_to_date": "2018-11-19 09:00:00",
          "date_applied": '1',
          "leave_type": "2",
          "image": 'thang'
        }
        , { headers: header }).subscribe(data => {
          console.log(data);
        })
  }


}
