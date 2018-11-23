import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginProvider } from '../login/loginAuth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import moment from 'moment';
import { api } from '../const/const';



/*
  Generated class for the CheckInProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CheckInProvider {
  urlCheckIn: string = api + "/checkIn";
  urlCheckOut: string = api + "/checkOut";
  isCheckInUrl = api + "/checkin-exists";
  isCheckOutUrl = api + "/checkout-exists";

  private _isCheckIn: BehaviorSubject<any>;
  private _isCheckOut: BehaviorSubject<any>;
  private _isError: BehaviorSubject<any>;

  constructor(
    public http: HttpClient,
    private _auth: LoginProvider,
    public storage: Storage
  ) {
    console.log('Hello CheckInProvider Provider');
    this.isCheckInDataStore = { _isCheckInData: [] }
    this._isCheckIn = new BehaviorSubject<any[]>([]);
    this.isCheckOutDataStore = { _isCheckOutData: [] }
    this._isCheckOut = new BehaviorSubject<any[]>([]);
    this.isErrorDataStore = { _isErrorInData: [] }
    this._isError = new BehaviorSubject<any[]>([]);
  }
  private isCheckInDataStore: {
    _isCheckInData: any
  }
  get isCheckInAlready(): Observable<any> {
    return this._isCheckIn.asObservable();
  }
  private isCheckOutDataStore: {
    _isCheckOutData: any
  }
  get isCheckOutAlready(): Observable<any> {
    return this._isCheckOut.asObservable();
  }

  private isErrorDataStore: {
    _isErrorInData: any
  }
  get isErrorCheckIn(): Observable<any> {
    return this._isError.asObservable();
  }


  async isCheckIn() {
    let header
    await this.buildHeader().then(data => {
      header = data
    })
    if (header) {
      return this.http.get(this.isCheckInUrl, { headers: header }).subscribe(data => {
        console.log(data);
        this.isCheckInDataStore._isCheckInData = data
        this._isCheckIn.next(Object.assign({}, this.isCheckInDataStore)._isCheckInData)
      }, error => {
        console.log(error.statusText);
        if(error.statusText === "Unauthorized"){
          this.storage.remove("token");
        }
      })
    }
  }
  async isCheckOut() {
    let header
    await this.buildHeader().then(data => {
      header = data
    })
    if (header) {
      return this.http.get(this.isCheckOutUrl, { headers: header }).subscribe(data => {
        console.log(data);
        this.isCheckOutDataStore._isCheckOutData = data
        this._isCheckOut.next(Object.assign({}, this.isCheckOutDataStore)._isCheckOutData)
      }, error => {
        console.log(error.statusText);
        if(error.statusText === "Unauthorized"){
          this.storage.remove("token");
        }
      })
    }
  }

  async checkIn(location: string, remarks: string) {
    var currentDate = moment(new Date()).format("HH:mm:ss")
    let header
    await this.buildHeader().then(data => {
      header = data
    })
    if (header) {
      return this.http.post(this.urlCheckIn, {
        "scan_in_location": location,
        "scan_in_remarks": remarks
      }, { headers: header }).subscribe(data => {
        this.storage.set("timeCheckIn", currentDate)
        console.log(data);
      }, error => {
        console.log(error)
        if(error.statusText === "Unauthorized"){
          this.storage.remove("token");
        }
      })
    }
  }
  async checkOut(location: string, remarks: string) {
    var currentTime = moment(new Date).format('h:mm:ss a');
    let header
    await this.buildHeader().then(data => {
      header = data
    })
    if (header) {
      return this.http.post(this.urlCheckOut, {
        "scan_out_location": location,
        "scan_out_remarks": remarks
      }, { headers: header }).subscribe(data => {
        console.log(remarks);
        this.storage.set("remarksCheckOut", remarks),
          this.storage.set("timeCheckOut", currentTime)
        console.log(data);
      }, error => {
        console.log(error)
        if(error.statusText === "Unauthorized"){
          this.storage.remove("token");
        }
      })
    }
  }
  async buildHeader() {
    let header
    await this._auth.tokenAuth().then(data => {
      if (data) {
        header = new HttpHeaders().set("Authorization", "Bearer " + data);
        header.set("'Content-type: application/x-www-form-urlencoded; charset=UTF-8'")
      }
    })
    return header
  }
  async getCheckInTime() {
    await this.storage.get("timeCheckIn").then(data => {
      console.log(data);

    })
  }
}
