import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';


/*
  Generated class for the HttpClientProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpClientProvider {

  constructor(
    public http: HttpClient,
    public storage: Storage) {
    console.log('Hello HttpClientProvider Provider');
  }
  buildHeaders(){
    let headers = new Headers({
      'Content-Type': 'application/json',
      'withCredentials': 'true'
    });

    return this.storage.get("user").then((user) => {
        if(user){
          let info = JSON.parse(user);
          console.log(info.token);
          headers.append('Authorization', 'Basic ' + info.token);
          return headers;
        }
      }
    )
  }

  // get(url) {
  //   return Observable
  //     .fromPromise(this.buildHeaders()).pipe()
  //     .switchMap((headers) => this.http.get(url, { headers: headers }));
  // }

}
