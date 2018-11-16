import { Component } from '@angular/core';
import { NavController,MenuController } from 'ionic-angular';
import {LoginProvider} from '../../providers/login/loginAuth'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loginService: LoginProvider) {
    this.menuCtrl.enable(true,'myMenu');
   this.loginService.tokenAuth();
  }
  

}
