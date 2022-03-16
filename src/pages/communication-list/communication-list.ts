import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsList } from '../../providers/providers';

/**
 * Generated class for the CommunicationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-communication-list',
  templateUrl: 'communication-list.html',
  providers: [ItemsList]

})
export class CommunicationListPage {
  item: any;
  form: FormGroup;
  public apiData: any;
  ActiveSegment: string;
  ActiveMaster: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, public itemlist: ItemsList, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

    this.ActiveSegment = 'StudentList';
    this.ActiveMaster = 'student-masters';
    this.loadapiData();
  }
  SendToStudent(item) {
    this.navCtrl.push('CommunicationPage', {
      sendTo: item, type: 'student',
    });
  }
  SendToClass(item) {
    this.navCtrl.push('CommunicationPage', {
      sendTo: item, type: 'class',
    });
  }
  openTab() {
    this.loadapiData();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunicationListPage');
  }
  loadapiData() {
    if (this.ActiveSegment == 'StudentList') {
      this.ActiveMaster = 'student-masters';
    } else if (this.ActiveSegment == 'ClassList') {
      this.ActiveMaster = 'class-masters';
    } else {
      this.ActiveMaster = 'users';
    }
    this.itemlist.query(this.ActiveMaster).then(results => {
      this.apiData = results;
    });
  }
}
