import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {LoginProvider} from '../login/loginAuth'
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the AuthInterceptorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthInterceptor  implements HttpInterceptor  {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'Content-Type' : 'application/json; charset=utf-8',
        'Accept'       : 'application/json',
        'Authorization': `Bearer ${this.loginAuth.tokenAuth()}`,
      },
    });

    return next.handle(req);
  }
  constructor(public http: HttpClient,
    public loginAuth: LoginProvider) {
    console.log('Hello AuthInterceptorProvider Provider');
  }

}
