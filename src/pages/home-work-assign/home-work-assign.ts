import { Component, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsList } from '../../providers/providers';
import { DatePicker } from '@ionic-native/date-picker';

import { Storage } from '@ionic/storage';
/**
 * Generated class for the HomeWorkAssignPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-work-assign',
  templateUrl: 'home-work-assign.html',
  providers: [ItemsList]

})
export class HomeWorkAssignPage {
  post_data: any;
  isReadyToSave: boolean;
  item: any;
  form: FormGroup;
  public apiData: any;
  public apiData_Date: any = [];
  public Classes: any;
  public Subjects: any;
  public Sections: any;
  public FilterDate: any;
  public search: any = {};
  public selected_date: any = "";
  date: string;
  type: 'string';
  DataArray: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, public viewCtrl: ViewController, public itemlist: ItemsList, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: Storage, private datePicker: DatePicker) {
    this.post_data = navParams.get('post_data');
    this.selected_date = this.getFormatedDate(this.post_data.date);
    console.log('post_data');
    console.log(this.post_data.date);
    console.log(this.selected_date);

    this.form = formBuilder.group({
      class_id: ['', Validators.required],
      subject_id: ['', Validators.required],
      section_id: ['', Validators.required],
      start_date: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
    this.loadSubjects();
    this.loadapiData();
  }
  done() {
    if (this.DataArray.length > 0) {
      this.viewCtrl.dismiss(this.DataArray);
    } else {
      let alert = this.alertCtrl.create({
        title: 'Please Do Assign',
        buttons: ['OK']
      })
      alert.present();
    }

  }


  loadSubjects() {
    this.itemlist.query('subject-masters').then(results => {
      this.Subjects = results;
    });
  }

  FilterByDate(date) {
    if (date == "") {
      this.search.start_date = new Date();
    } else {
      this.search.start_date = this.getFormatedDate(date);
    }
    this.loadapiData();
  }
  onChange(value, selector) {
    console.log(value);
    if (selector == 'class') {
      this.search.class_id = value;
    }
    if (selector == 'subject') {
      this.search.subject_id = value;
    }
    if (selector == 'section') {
      this.search.section_id = value;
    }


    this.loadapiData();
  }
  loadapiData_searchdates() {
    var search = { 'start_date_distinct': true };
    this.itemlist.search('homeworks/search' + '?expand=subject,class', search).then(results => {
      if (results.hasOwnProperty('length') && results instanceof Array) {
        var arr_length = results.length;
        for (var i = 0; i <= arr_length - 1;) {
          if (i != undefined && results[i].formated_date != undefined) {
            this.apiData_Date.push(results[i]);
            console.log(this.apiData_Date);
          }
          i++;
        }
      }
      this.presentLoading(1);
    });
  }

  loadapiData(searchModel = {}) {
    this.presentLoading();
    if (this.post_data.formated_date) {
      this.search.formated_date = this.post_data.formated_date;
    }
    this.itemlist.search('homeworks/search' + '?expand=subject,class', this.search).then(results => {
      this.apiData = results;
      this.presentLoading(1);
    });
  }
  FilterDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => this.FilterByDate(date),
      err => this.FilterByDate(new Date())
    );
  }

  letsUpdateLS() {
 

    this.navCtrl.push('HomeWorkPage');
  }
  addItem() {
    var post_data = this.form.value;
    if (post_data.description != "") {
      post_data.class_id = this.post_data.class_id;
      post_data.section_id = this.post_data.section_id;

      post_data.date = this.post_data.date;

      post_data.formated_date = this.post_data.formated_date;
    }
    if (this.form.value) {
      console.log(post_data.date);
      this.itemlist.add('homeworks', post_data).then(results => {
        this.apiData.push(results);
        this.DataArray.push(results);

        let toast = this.toastCtrl.create({
          message: 'Item Created Successfully',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
    }
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeWorkPage');
  }
  getFormatedDate(getDate = false) {
    var m_names = new Array("Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec");
    var d;
    if (getDate) {
      d = getDate;
    } else {
      d = new Date();
    }
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    var return_date = curr_date + "-" + m_names[curr_month]
      + "-" + curr_year;
    return return_date;
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
