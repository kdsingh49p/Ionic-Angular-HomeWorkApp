import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsList } from '../../providers/providers';
import { Item } from '../../models/item';

/**
 * Generated class for the UserMasterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-master',
  templateUrl: 'user-master.html',
  providers: [ItemsList]

})
export class UserMasterPage {
  @ViewChild('fileInput') fileInput;
  isReadyToSave: boolean;
  item: any;
  form: FormGroup;
  public apiData: any;
  public Classes: any;
  ActiveSegment: any;
  ActiveMaster: any;
  _meta: any;
  searchQuery: string = '';
  searchitems: string[];
  searchitemsfilter: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, public itemlist: ItemsList, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.form = formBuilder.group({
      title: ['', Validators.required],
      class_id: ['', Validators.required],
    });
    this.ActiveSegment = 'UserMaster';
    this.ActiveMaster = 'users';
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    //this.loadapiData();  
    this.initializeItems();
  }
  initializeItems() {
    this.presentLoading();
    this.presentLoading();
    this.itemlist.search(this.ActiveMaster + '/search', { 'pageSize': 50, 'type': 'staff' }).then((results: any) => {
      if (results.items != null) {
        this.searchitems = results.items;
        this.initializedItems();
      }
      this.presentLoading(1);
    });
  }
  initializedItems() {
    this.searchitemsfilter = this.searchitems;
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializedItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    console.log(this.searchitems);
    if (val && val.trim() != '' && val.length > 3) {
      this.searchitemsfilter = this.searchitemsfilter.filter((item: any) => {
        if (item.name) {
          return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
      })
    }
  }

  loadapiData() {
    this.presentLoading();
    this.itemlist.search(this.ActiveMaster + '/search', { 'pageSize': 50, 'type': 'staff' }).then((results: any) => {
      if (results.items != null) {
        this.apiData = results.items;
        this._meta = results._meta;
      }
      this.presentLoading(1);
    });
  }

  doInfinite(infiniteScroll) {

    console.log(this._meta.pageCount);
    console.log(this._meta.currentPage + 1);
    if (this._meta.pageCount >= this._meta.currentPage + 1) {

      this.itemlist.search(this.ActiveMaster + '/search', { 'page': this._meta.currentPage + 1, 'type': 'staff' }).then((results: any) => {

        if (results.items.length > 0) {
          this._meta = results._meta;
          setTimeout(() => {
            for (let i = 0; i < results.items.length; i++) {
              this.apiData.push(results.items[i]);
            }
            infiniteScroll.complete();
          }, 500);
        }



      });
    } else {

    }

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClassMasterPage');
  }
  showPrompt(item) {
    let prompt = this.alertCtrl.create({
      title: 'Edit',
      message: "Edit title",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value: item.title
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (data) {
              data.id = item.id;
              this.itemlist.edit(this.ActiveMaster, data).then(results => {
                this.loadapiData();
                let toast = this.toastCtrl.create({
                  message: 'Class Edited',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();

              });
            }
          }
        }
      ]
    });
    prompt.present();
  }
  done() {
    if (!this.form.valid) { return; }
    //this.viewCtrl.dismiss(this.form.value);
  }

  deleteItem(item) {
    this.presentLoading();
    this.itemlist.delete(this.ActiveMaster, item).then(results => {
      this.loadapiData();
      this.presentLoading(1);
    });
  }
  goToCreate() {
    this.navCtrl.push('SignupPage', {
      type: 'staff'
    });
  }
  addItem() {
    var post_data = this.form.value;
    post_data.status = 10;
    if (this.form.value) {
      this.itemlist.add(this.ActiveMaster, post_data).then(results => {
        let toast = this.toastCtrl.create({
          message: 'Item Created Successfully',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
    }
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
  openItem(item: Item) {
    item.previous_page = 'UserMasterPage';
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

}

