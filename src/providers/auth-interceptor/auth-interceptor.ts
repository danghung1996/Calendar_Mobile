import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {LoginProvider} from '../login/loginAuth'
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular/umd';

/*
  Generated class for the AuthInterceptorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthInterceptor {
  constructor(public http: HttpClient,
    public loginAuth: LoginProvider,
    public storage: Storage,) {
    console.log('Hello AuthInterceptorProvider Provider');
  }
  tokenExpired(){
    
  }
}
