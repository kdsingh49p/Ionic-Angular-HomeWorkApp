import { Component, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { IonicPage, NavController, ModalController, AlertController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsList } from '../../providers/providers';
import { DatePicker } from '@ionic-native/date-picker';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Core } from '../../services/core';

/**
 * Generated class for the HomeWorkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-work',
  templateUrl: 'home-work.html',
  providers: [ItemsList]
})
@Pipe({
  name: 'filterUnique',
  pure: false
})
export class HomeWorkPage {
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  public calendar = {
    mode: 'month',
    currentDate: new Date(),
    noEventsLabel: "No Homework"
  };
  isReadyToSave: boolean;
  storage_val: any;

  item: any;
  form: FormGroup;
  class_selected: any;
  section_selected: any;
  public apiData: any;
  public apiData_Date: any = [];
  public Classes: any;
  public Subjects: any;
  public Sections: any;
  public isStudent: any;
  public isStaff: any;
  public FilterDate: any;
  public search: any = {
    'class_id': '',
    'section_id': '',
  };
  currentYear: any = new Date().getFullYear();
  date: string;
  type: 'string';
  optionsMulti: any = {
    daysConfig: 'multi'
  };
  constructor(public core: Core, public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, public itemlist: ItemsList, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private datePicker: DatePicker, public storage: Storage, private modalCtrl: ModalController) {
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
    this.optionsMulti.from = new Date(this.currentYear, 0, 1);
    //this.optionsMulti.daysConfig = navParams.get('AssignedDatesCalendar') || null;
    //this.openCal();
    //this.loadSubjects();
    console.log('isStudent');
    this.core.isStudent().then(status => {
      this.isStudent = status;
    });
    console.log('isStaff');
    this.core.isStaff().then((status) => {
      this.isStaff = status;
    });
    this.loadClasses();

    //this.loadapiData();
    console.log(this.Subjects);

  }
  swipenext() {
    var mySwiper = document.querySelector('.swiper-container')['swiper'];
    mySwiper.slideNext();
  }
  swipeprev() {
    var mySwiper = document.querySelector('.swiper-container')['swiper'];
    mySwiper.slidePrev();
  }
  addEvent() {
    var post_data = this.form.value;
    post_data.date = this.selectedDay;


    let modal = this.modalCtrl.create('HomeWorkAssignPage', { post_data: post_data });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let events = this.eventSource;
        if (data.length > 0) {
          for (let index = 0; index < data.length; index++) {
            console.log('loops');
            let eventData = data[index];
            console.log(index, data[index]);
            eventData.title = data[index].subject.title;
            eventData.description = data[index].description;
            eventData.startTime = new Date(data[index].date);
            eventData.endTime = new Date(data[index].date);

            events.push(eventData);
          }

        } else {
          let eventData = data;
          eventData.title = data.subject.title;
          eventData.description = data.description;
          eventData.startTime = new Date(data.date);
          eventData.endTime = new Date(data.date);
          events.push(eventData);
        }




        this.eventSource = [];

        console.log(events);
        setTimeout(() => {
          this.eventSource = events;
        });
      }
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    //  let end = moment(event.endTime).format('LLLL');
    console.log(event);

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: event.description,
      buttons: ['OK']
    });

    alert.present();
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }




  openCal() {
    this.storage.get('calenderAssignedDates').then((val) => {
      if (val) {
        this.storage_val = val;

        console.log(val);
      }
    });
    //this.optionsMulti.daysConfig = this.storage_val;
    console.log(this.optionsMulti.daysConfig);

  }
  loadClasses() {
    this.core.presentLoading();
    this.itemlist.query('class-masters').then(results => {

      this.Classes = results;
      if (this.Classes[0]) {
        this.class_selected = this.Classes[0].id;
        this.search.class_id = this.Classes[0].id;
        this.loadSections();

        console.log('class load');
      }


    });
  }
  onChange2($event) {
    console.log($event[0]._d);
    var post_data = this.form.value;
    if ($event[0] != "") {
      post_data.date = $event[0]._d;
      post_data.formated_date = this.getFormatedDate($event[0]._d);
    }
    if (this.form.value) {
      this.navCtrl.push('HomeWorkAssignPage', {
        post_data: post_data
      });
    }

  }
  loadSubjects() {
    this.itemlist.query('subject-masters').then(results => {
      this.Subjects = results;
    });
  }
  loadSections() {
    this.itemlist.query('section-masters').then(results => {
      this.Sections = results;
      if (this.Sections[0]) {
        this.section_selected = this.Sections[0].id;
        this.search.section_id = this.Sections[0].id;
        this.loadapiData_searchdates();

        console.log('section load');
      }
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

    this.core.presentLoading();
    this.loadapiData_searchdates();
  }
  loadapiData_searchdates() {
    console.log(this.search);
    //    this.search.start_date_distinct= true;
    if (this.search.class_id != "") {

      this.itemlist.search('homeworks/search' + '?expand=subject,class', this.search).then(results => {
        if (results.hasOwnProperty('length') && results instanceof Array) {
          console.log(results);
          var arr_length = results.length;
          console.log(arr_length);
          let _daysConfig = [];
          console.log('_daysConfig');
          console.log(_daysConfig);
          console.log('before loop');
          for (var i = 0; i <= arr_length - 1;) {
            if (i != undefined && results[i].date != undefined) {
              console.log(results[i].date);
              _daysConfig.push({
                startTime: new Date(results[i].date),
                title: results[i].subject.title,
                description: results[i].description,
                endTime: new Date(results[i].date),
              })



            }
            i++;
          }
          setTimeout(() => {
            if (i || i == 0) {
              this.eventSource = [];
              setTimeout(() => {
                console.log('after loop');
                this.eventSource = _daysConfig;
              });
              this.core.presentLoading(1);
            }
          }, 1000);



        }

      });

    }



  }

  loadapiData(searchModel = {}) {
    this.presentLoading();
    this.itemlist.search('homeworks/search' + '?expand=subject,class', this.search).then(results => {
      this.apiData = results;
      //for(var i=0; i<=this.apiData.length-1;){
      //if(i!=undefined && this.apiData[i].formated_date!=undefined){
      //this.apiData_Date.push(this.apiData[i].formated_date);
      //}
      //i++;
      // }


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

  showDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => this.form.patchValue({ 'start_date': date }),
      err => console.log('Error occurred while getting date: ', err)
    );
  }
  addItem() {
    var post_data = this.form.value;
    if (post_data.start_date != "") {
      post_data.date = post_data.start_date;
      post_data.formated_date = this.getFormatedDate(post_data.start_date);
    } else {
      post_data.date = new Date();
      post_data.formated_date = this.getFormatedDate();
    }
    if (this.form.value) {
      this.itemlist.add('homeworks', post_data).then(results => {
        this.apiData.push(results);
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
  back() {
    this.navCtrl.push('HomePage');
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
export class FilterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let uniqueArray = Array.from(new Set(value));
    return uniqueArray;
  }

}