import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsList } from '../../providers/providers';

/**
 * Generated class for the ClassMasterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-class-master',
  templateUrl: 'class-master.html',
  providers: [ItemsList]

})
export class ClassMasterPage {
  @ViewChild('fileInput') fileInput;
  isReadyToSave: boolean;
  item: any;
  form: FormGroup;
  public apiData: any;
  public Classes: any;
  ActiveSegment: any;
  ActiveMaster: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, public itemlist: ItemsList, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.form = formBuilder.group({
      title: ['', Validators.required],
      class_id: ['', Validators.required],
    });
    this.ActiveSegment = 'ClassMaster';

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    this.loadapiData();
  }


  loadapiData() {
    if (this.ActiveSegment == 'ClassMaster') {
      this.ActiveMaster = 'class-masters';
    } else {
      this.ActiveMaster = 'section-masters';
      this.itemlist.query('class-masters').then(results => {
        this.Classes = results;
        console.log(this.Classes);

      });
    }
    console.log(this.ActiveSegment);
    this.presentLoading();

    this.itemlist.query(this.ActiveMaster).then(results => {
      this.apiData = results;
      this.presentLoading(1);
    });
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
  classmaster() {
    //    this.navCtrl.push('ClassMasterPage');
    this.loadapiData();
  }
  sectionMaster() {
    //this.navCtrl.push('SectionMasterPage');
    this.loadapiData();

  }

  deleteItem(item) {
    this.presentLoading();
    this.itemlist.delete(this.ActiveMaster, item).then(results => {
      this.loadapiData();
      this.presentLoading(1);
    });
  }
  addItem() {
    var post_data = this.form.value;
    post_data.status = 10;
    if (this.form.value) {
      this.itemlist.add(this.ActiveMaster, post_data).then(results => {
        if (results) {
          this.apiData.push(results);
          let toast = this.toastCtrl.create({
            message: 'Item Created Successfully',
            duration: 3000,
            position: 'top'
          });
          toast.present();

        }
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

}

