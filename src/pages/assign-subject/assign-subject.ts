import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsList } from '../../providers/providers';

/**
 * Generated class for the AssignSubjectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assign-subject',
  templateUrl: 'assign-subject.html',
  providers: [ItemsList]

})
export class AssignSubjectPage {


  @ViewChild('fileInput') fileInput;
  isReadyToSave: boolean;
  item: any;
  form: FormGroup;
  public apiData: any;
  public Classes: any;
  public Subjects: any;
  ActiveSegment: any;
  ActiveMaster: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, public itemlist: ItemsList, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.form = formBuilder.group({
      class_id: ['', Validators.required],
      subject_id: ['', Validators.required],
    });
    this.ActiveSegment = 'AssignSubject';
    this.ActiveMaster = 'assign-subjects';
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    this.loadClasses();
    this.loadapiData();
    this.loadSubjects();
  }

  loadClasses() {
    this.itemlist.query('class-masters').then(results => {
      this.Classes = results;
      console.log(this.Classes);
    });
  }
  loadSubjects() {
    this.itemlist.query('subject-masters').then(results => {
      this.Subjects = results;
    });
  }

  loadapiData() {
    this.presentLoading();
    this.itemlist.query(this.ActiveMaster + '?expand=subject,class').then(results => {
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
          value: item.title,
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
  addItem() {
    var post_data = this.form.value;
    post_data.status = 10;
    if (this.form.value) {
      this.itemlist.add(this.ActiveMaster, post_data).then(results => {
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

  editItem(item) {
    item.previous_page = 'AssignSubjectPage';
    this.navCtrl.push('EditFormMasterPage', {
      item: item
    });
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

