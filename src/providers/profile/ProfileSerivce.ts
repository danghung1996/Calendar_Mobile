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
  urlGetProfile: string = "http://10.0.105.20:1111/api/employee-data";
  constructor(public httpClient: HttpClient,
    private _auth: LoginProvider) {
    console.log('Hello ProfileProvider Provider');
  }
  getUserProfile() {
    console.log(this.buildHeaer());
    let headers = new Headers(this.buildHeaer());
    this.httpClient.get(this.urlGetProfile)
  }
   buildHeaer() {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'withCredentials': 'true'
    });
   headers.append('Authorization', 'Basic ' + this._auth.auth());
    return headers;
  }

}
