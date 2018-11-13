import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoginProvider } from '../../providers/login/loginAuth'
import { _iterableDiffersFactory } from '@angular/core/src/application_module';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string = "";
  password: string = "";
  cucumber: boolean = false;
  isLogged: boolean = false;
  isFailed: boolean = false;
  listCompany: string[] = [
    "Company A", "Company B", "Company C"
  ]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
     private _loginService: LoginProvider
  ) {
    this.menuCtrl.enable(false, 'myMenu');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  loginConfirm(){
    this.navCtrl.setRoot(HomePage);
  }
  login() {
    // this._loginService.login("thangnv@gmail.com","thangpro123").subscribe(
    //   data =>{
    //     console.log(data['_body'])
    //     console.log(JSON.stringify(data['_body']))
        
    //   },error => {
    //     console.log(error)
    //   }
    // )
    // console.log(this.username+"--"+this.password+"---"+this.cucumber);
    if(this.username === '123' && this.password === '123'){
      // this.loadingDate();

      this.isLogged = true;
    }else{
      this.isFailed = true;
    }
  }

  loadingDate() {
    let loading = this.loadingCtrl.create({
      content: ''
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 1000);
  }
  reTry() {
    this.isFailed = false;
  }

}
