import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { LoginProvider } from '../../providers/login/loginAuth'
import { _iterableDiffersFactory } from '@angular/core/src/application_module';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms'
import { AttendancePage } from '../attendance/attendance';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  formGroup: FormGroup;
  isLogged: boolean = false;
  isFailed: boolean = false;
  isLoading:boolean = false;
  listCompany: string[] = [
    "Company A", "Company B", "Company C"
  ]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private _loginService: LoginProvider,
    private _storage: Storage,
    public formBuilder: FormBuilder
  ) {
    this.menuCtrl.enable(false, 'myMenu');
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(".+\@.+\..+")]),
      password: new FormControl('', [Validators.required]),
      cucumber: new FormControl(false, [Validators.required])
    })
    this.isLoginAlready()
  }
  isLoginAlready() {
    this._loginService.tokenAuth().then(data => {
      if(data){
        this.navCtrl.setRoot(AttendancePage);
      }
    })
  } 
  presentLoading(mess: string) {
      const loader = this.loadingCtrl.create({
        content: mess,
      });
      loader.present();
  }

  ionViewDidLoad() {
    
  }
  loginConfirm() {
    this.navCtrl.setRoot(AttendancePage);
  }
  login() {
    if (!this.formGroup.valid) {
      console.log("error");
      return
    } else {
      // this._storage.set("token", "123123123123")
      // this.isLogged = true;
      const loader = this.loadingCtrl.create({
        content: "Login Authentication",
      });
      loader.present();
      this._loginService.login("thangnv@gmail.com", "thangpro123").subscribe(
        data => {
          console.log("vao roi");
          
          var token = data['token']
          if (token !== undefined && token !== null) {
            this._storage.set("token", token)
            loader.dismiss();
            console.log(token);
  
          }
          this.isLogged = true;
        }, error => {
          console.log(error)
          loader.dismiss();
        }
      )
    }

   
    // console.log(this.username+"--"+this.password+"---"+this.cucumber);
    // if(this.formGroup.get("email") === '123'){

    //   this.isLogged = true;
    // }else{
    //   this.isFailed = true;
    // }
  }

  // loadingDate() {
  //   let loading = this.loadingCtrl.create({
  //     content: ''
  //   });

  //   loading.present();

  //   setTimeout(() => {
  //     loading.dismiss();
  //   }, 1000);
  // }

  reTry() {
    this.isFailed = false;
  }

}
