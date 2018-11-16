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
export class AuthInterceptor implements HttpInterceptor  {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    let promise = this.storage.get('token');
   return Observable.fromPromise(promise)
   .mergeMap(token =>{
     let cloneReq = this.addToken(req,token);

     return next.handle(cloneReq)
   })
  }
  private addToken(request: HttpRequest<any>,token:any){
    if(token){
      let clone:HttpRequest<any>;
      clone = request.clone({
        setHeaders:{
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      return clone;
    }
  }
  constructor(public http: HttpClient,
    public loginAuth: LoginProvider,
    public storage: Storage,
    private alertCtrl: AlertController) {
    console.log('Hello AuthInterceptorProvider Provider');
  }

}
