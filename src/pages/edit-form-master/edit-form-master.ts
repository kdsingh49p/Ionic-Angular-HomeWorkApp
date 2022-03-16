import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsList } from '../../providers/providers';

/**
 * Generated class for the EditFormMasterPage page.
   *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 */

@IonicPage()
@Component({
  selector: 'page-edit-form-master',
  templateUrl: 'edit-form-master.html',
  providers: [ItemsList]

})
export class EditFormMasterPage {
  isReadyToSave: boolean;
  item: any;
  public apiData: any;
  public Classes: any;
  public Subjects: any;
  public Sections: any;
  ActiveSegment: any;
  ActiveMaster: any;
  todo: { class_array: string, subject_id: string } = {
    class_array: '',
    subject_id: ''
  };
  student: { class_id: string, contact_email: string, contact_phone: string, date_of_birth: string, father_name: string, mother_name: string, student_name: string, section_id: string } = {
    class_id: '',
    contact_email: '',
    contact_phone: '',
    date_of_birth: '',
    father_name: '',
    mother_name: '',
    student_name: '',
    section_id: '',

  };

  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, public itemlist: ItemsList, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.item = navParams.get('item');
    console.log(this.item);
    this.loadneededapi();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditFormMasterPage');
  }
  loadneededapi() {
    if (this.item.previous_page == 'AssignSubjectPage') {
      this.todo = this.item;
      this.ActiveMaster = 'assign-subjects';
      this.loadapiData();
      this.loadClasses();
      this.loadSubjects();
      console.log('Loading AssignSubjectPage');
    } else if (this.item.previous_page == 'StudentMasterPage') {
      this.student = this.item;
      this.ActiveMaster = 'student-masters';
      this.loadClasses();
      this.loadSections();
    }

  }
  loadClasses() {
    this.itemlist.query('class-masters').then(results => {
      this.Classes = results;
      console.log(results);
    });
  }
  loadSections() {
    this.itemlist.query('section-masters').then(results => {
      this.Sections = results;
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

  editItem() {
    var post_data = {
      subject_id: this.todo.subject_id,
      class_id: this.todo.class_array,
      id: this.item.id
    };
    this.itemlist.edit(this.ActiveMaster, post_data).then(results => {
      let toast = this.toastCtrl.create({
        message: 'Item Edited Successfully',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.push('AssignSubjectPage');
    });

  }
  editStudent() {
    var post_data = {
      contact_email: this.student.contact_email,
      contact_phone: this.student.contact_phone,
      date_of_birth: this.student.date_of_birth,
      father_name: this.student.father_name,
      mother_name: this.student.mother_name,
      student_name: this.student.student_name,
      section_id: this.student.section_id,
      class_id: this.student.class_id,
      id: this.item.id
    };
    this.itemlist.edit(this.ActiveMaster, post_data).then(results => {
      let toast = this.toastCtrl.create({
        message: 'Item Edited Successfully',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.push(this.item.previous_page);
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
