import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Account } from '../../Model/EmployeeAccount';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {
  urlLogin = "http://10.0.96.11:1111/api/login";
  
  constructor(
    public http: Http
  ) {
    console.log('Hello LoginProvider Provider');
  }



  login(email: string, password: string) {
    return this.http.post(this.urlLogin, {
      "email": email,
      "password": password
    })
  }

}
