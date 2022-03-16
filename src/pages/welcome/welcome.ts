import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { MainPage } from '../pages';
import { Storage } from '@ionic/storage';
/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController, private storage: Storage) { 
    this.storage.set('rootPage', 'WelcomePage');
  }
  login() {
    this.initateforcheckopenapp();
    this.navCtrl.push('LoginPage');
  }
  signup() {
    this.initateforcheckopenapp();
    this.navCtrl.push('SignupPage');
  }
  initateforcheckopenapp(){
    this.storage.set('rootPage', 'WelcomePage');
  }
  ionViewDidLoad() {
        
  }
}
