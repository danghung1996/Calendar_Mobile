import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, ToastController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { LoginProvider } from '../../providers/login/loginAuth'
import { _iterableDiffersFactory } from '@angular/core/src/application_module';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms'
import { AttendancePage } from '../attendance/attendance';
import { ProfilePage } from '../profile/profile';
import { ScrollHideConfig } from '../../providers/const/scroll-hide';
import { ProfileProvider } from '../../providers/profile/ProfileSerivce';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  formGroup: FormGroup;
  isLogged: boolean = false;
  isFailed: boolean = false;
  isLoading: boolean = false;
  listCompany: string[] = [
    "Company Name A", "Company Name B", "Company Name C"
  ]
  company: any = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private _loginService: LoginProvider,
    private _storage: Storage,
    private _profileProvider : ProfileProvider,
    public formBuilder: FormBuilder,
    public toastCtrl: ToastController,
  ) {
    this.menuCtrl.enable(false, 'myMenu');
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(".+\@.+\..+")]),
      password: new FormControl('', [Validators.required]),
      cucumber: new FormControl(false, [Validators.required])
    })
    this.isLoginAlready()
  }
  //check already login
  isLoginAlready() {
    this._loginService.tokenAuth().then(data => {
      if (data) {
        this.navCtrl.setRoot(AttendancePage);
      }
    })
  }
  //select list company
  selectCompany(index) {
    console.log(index);
    this.company = index
    console.log(this.company);
    
  }
  
  presentLoading(mess: string) {
    const loader = this.loadingCtrl.create({
      content: mess,
    });
    loader.present();
  }

  ionViewDidLoad() {
  //confrm after select company
  }
  loginConfirm() {
    this.navCtrl.setRoot(ProfilePage);
  }

  //login
  login() {
    //invalid data
    if (!this.formGroup.valid) {
      console.log("error");
      const toast = this.toastCtrl.create({
        message: 'Please! Check Email and Password',
        duration: 1500,
        cssClass: 'success',
        position: 'top'
      });
      toast.present();
      return
    } else {
      const loader = this.loadingCtrl.create({
        content: "Login Authentication",
      });
      loader.present();
      //call login service
      this._loginService.login(this.formGroup.controls.email.value, this.formGroup.controls.password.value).subscribe(
        data => {
          var token = data['token']
          if (token !== undefined && token !== null) {
            this._storage.set("token", token)
            loader.dismiss();
            console.log(token);
            //login success and navigate
            this._profileProvider.getUserProfile();
            this.navCtrl.setRoot(ProfilePage);
          }
          this.isLogged = true;
        }, error => {
          console.log(error)
          loader.dismiss();
          this.isFailed = true;
          this.isLogged = false
        }
      )
    }
  }
  //re-try action.
  reTry() {
    this.isFailed = false;
  }

}
