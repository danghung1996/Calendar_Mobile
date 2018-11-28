import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/ProfileSerivce'
import { fromPromise } from 'rxjs/observable/fromPromise';
import { ApplyleaveProvider } from '../../providers/applyleave/applyleave';
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

  employeeName: string
  employeeID: string
  department: string
  designnation: string
  supervisor: string
  hrMaster: string
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public profileService: ProfileProvider,
    public apple: ApplyleaveProvider) {
    this.menuCtrl.enable(true, 'myMenu');
  }

  ionViewDidLoad() {
    //get data from server.
    this.profileService.getUserProfile()
    this.profileService.getProfile.subscribe(data => {
      this.employeeName = data['employee_name'];
      this.employeeID = data['employee_id'];
      this.department = data['department'];
      this.designnation = data['designation'];
      this.hrMaster = data['hr_master'];
      this.supervisor = data['supervisor'];
    })
  }

}
