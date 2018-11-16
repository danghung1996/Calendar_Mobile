import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import {ProfileProvider} from '../../providers/profile/ProfileSerivce'
import { fromPromise } from 'rxjs/observable/fromPromise';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
      public menuCtrl: MenuController,
      public profileService: ProfileProvider) {
  	this.menuCtrl.enable(true,'myMenu');
  }
  tapEvent(event){
    console.log(event);
    
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    console.log(this.profileService.getUserProfile());
    
  }

}
