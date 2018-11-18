import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '../../Model/EmployeeAccount';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';


/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {
  urlLogin = "http://202.160.1.102:8085/api/login";
  token:string = "";
  constructor(
    public http: HttpClient,
    public storage: Storage
  ) {
    console.log('Hello LoginProvider Provider');
  }
  login(email: string, password: string) {
    return this.http.post(this.urlLogin,{
      "email": email,
      "password": password
    })
  }
  async tokenAuth(){
   await this.getToken();
   if(this.token !== null && this.token !==undefined){
     return this.token;
   }
   return false;
  }
  async ExpiredToken(){

  }
   async getToken(){
    await this.storage.get("token").then(data => {  
      this.token = data;  
    })
  }


}
