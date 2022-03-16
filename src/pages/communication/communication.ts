import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsList } from '../../providers/providers';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-communication',
  templateUrl: 'communication.html',
  providers: [ItemsList],

})
export class CommunicationPage {
  isReadyToSave: boolean;
  item: any;
  form: FormGroup;
  public apiData: any;
  public user: any;
  sendTo: any;
  receiverType: any;
  search: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, public itemlist: ItemsList, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: Storage) {
    this.form = formBuilder.group({
      message: ['', Validators.required],
    });
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
    this.sendTo = navParams.get('sendTo');
    this.receiverType = navParams.get('type');
    console.log(this.sendTo);
    console.log(this.receiverType);
    this.storage.get('user').then((val) => {
      this.user = val.user;
    });
    this.loadapiData();
  }
  loadapiData() {
    this.presentLoading();
    this.search = {
      'from_id': this.sendTo.id,
    };
    if (this.receiverType == 'class') {
      this.search.to_class = this.sendTo.id;
    }
    console.log(this.search);
    this.storage.get('user').then((val) => {
      this.search.to_id = val.user.id;
      console.log(val.user);
      this.itemlist.search('messages/search?access-token=' + val.auth_token, this.search).then(results => {
        this.apiData = results;
        this.presentLoading(1);
      });
    });
  }
  addItem() {
    var post_data = this.form.value;
    this.storage.get('user').then((val) => {
      if (val) {
        post_data.from_id = val.user.id;
        post_data.to_id = this.sendTo.id;
        post_data.created_at = new Date();
        post_data.status = 10;

        if (this.form.value) {
          var apiUrl = 'messages';
          if (this.receiverType == 'class') {
            post_data.to_class = this.sendTo.id;
            apiUrl = 'messages/send';
          }
          console.log(apiUrl);
          this.itemlist.add(apiUrl + '?access-token=' + val.auth_token, post_data).then(results => {
            if (this.receiverType == 'class') {
              this.loadapiData();
            } else {
              this.apiData.push(results);
            }

            let toast = this.toastCtrl.create({
              message: 'Item Created Successfully',
              duration: 3000,
              position: 'top'
            });
            toast.present();
          });
        }
      } else {
        alert('Login Required');
        return false;
      }
    });


  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunicationPage');
  }
  presentLoading(dismiss = 0) {
    let loader = this.loadingCtrl.create({
      content: "Loading..",
      duration: 2000
    });
    if (dismiss) {
      loader.dismiss();
    }
    loader.present();
  }

}
