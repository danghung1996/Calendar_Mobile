import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { LoginProvider } from '../login/loginAuth'
import { Profile } from '../../Model/Profile';
import { BehaviorSubject, Observable } from 'rxjs';
import { Nav } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../../pages/login/login';

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileProvider {
  @ViewChild(Nav) nav: Nav;
  port = "10.0.105.20:1111"
  urlGetProfile: string = "http://10.0.105.20:1111/api/employee-data";
  profile: any
  private _profile: BehaviorSubject<Profile[]>;
  constructor(
    public httpClient: HttpClient,
    private _loginService: LoginProvider,
    public storage: Storage
    ) {
    this.dataStore = {_profileData: []}
    this._profile = new BehaviorSubject<Profile[]>([]);
  }

  private dataStore: {
    _profileData: Profile[]
  }
  get getProfile(): Observable<Profile[]> {
    return this._profile.asObservable();
  }



  async getUserProfile() {
    let header
    await this.buildHeader().then(data => {
      header = data
    })
    if (header) {
      return this.httpClient.get(this.urlGetProfile, { headers: header }).subscribe(data => {
        console.log(data['data']);
        this.dataStore._profileData = data['data']
        if (this.dataStore._profileData) {
          this._profile.next(Object.assign({}, this.dataStore)._profileData)
        }
      }, error => {
          if(error.statusText === "Unauthorized"){
            this.storage.remove("token");
          }
        })
    }
  }
  async buildHeader() {
    let header
    await this._loginService.tokenAuth().then(data => {
      if (data) {
        console.log(data);
        
        header = new HttpHeaders().set("Authorization", "Bearer " + data);
      }
    })
    return header
  }
}
