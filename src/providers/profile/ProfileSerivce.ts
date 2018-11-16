import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginProvider } from '../login/loginAuth'
import { RequestOptions } from '@angular/http';
import { Profile } from '../../Model/Profile';

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileProvider {
  urlGetProfile: string = "http://10.0.96.26:1111/api/employee-data";
  constructor(public httpClient: HttpClient,
    private _auth: LoginProvider) {
    console.log('Hello ProfileProvider Provider');
  }
  getUserProfile() {
    this.httpClient.get(this.urlGetProfile).subscribe(data => {
      console.log(data);
      
    })
  }
   buildHeaer() {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'withCredentials': 'true'
    });
   headers.append('Authorization', 'Basic ' + this._auth.tokenAuth());
    return headers;
  }

}
