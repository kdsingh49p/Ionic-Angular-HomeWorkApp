import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ItemsList } from '../../providers/providers';
import { Core } from '../../services/core';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ItemsList]

})
export class HomePage {
  public notice: any = false;
  public isStudent: any;
  public isStaff: any;
  public user: { name: string } = {
    name: 'user',
  };
  public type: any;
  public stats: any = false;
  constructor(public core: Core, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, private storage: Storage, public itemlist: ItemsList) {
    console.log('user');
    this.core.presentLoading();
    this.core.getUser().then((data) => {
      console.log(data);
    });

    console.log('isStudent');
    this.core.isStudent().then(status => {
      this.isStudent = status;
    });
    console.log('isStaff');
    this.core.isStaff().then((status) => {
      this.isStaff = status;
    });

    setTimeout(() => {
      this.getStats();


    }, 20);
  }
  loadapiData_searchdates() {

  }
  getStats() {
    this.itemlist.search('users/stats').then((data: any) => {
      if (data.items) {
        this.stats = data.items;
        this.storage.set('stats', data.items).then(done => {
          console.log(this.stats);
          this.getNotifications();
        });
      }
    });
  }
  getNotifications() {
    this.itemlist.search('notifications/search').then((data: any) => {
      if (data.length > 0) {
        this.notice = data;
      } else {
        this.notice = false;
      }
      this.core.presentLoading(1);
    });
  }
  studentMaster() {
    this.presentActionSheet();
  };
  opennotications() {
    this.navCtrl.push('NotificationListPage');
  }
  classMaster() {
    this.navCtrl.push('ClassMasterPage');
  };
  gallery() {
    this.navCtrl.push('GalleryPage');
  }
  openHomeWork() {
    this.navCtrl.push('HomeWorkPage');
    /*             
       var search = {'start_date_distinct' : true};
     this.itemlist.search('homeworks/search'+'?expand=subject,class',search).then(results=> {
       if(results.hasOwnProperty('length') && results instanceof Array) { 
         var arr_length = results.length;
         let _daysConfig = [];
         for(var i=0; i<=arr_length-1;){
           if(i!=undefined && results[i].date!=undefined){
             console.log(results[i].date);
             _daysConfig.push({
               date: results[i].date,
               marked: 'light',
               i: i,
               cssClass: 'assignedHWActive a'
             })
 
 
 
          }
           i++;
         }
         if(i){
           this.storage.set('calenderAssignedDates', _daysConfig).then((val_save) => {
             this.storage.get('calenderAssignedDates').then((val) => {
               if(val){
                 console.log(val);
                  
               }
             }); 
           });
         }
         
       }
       this.presentLoading(1);
     });
   */
    //  this.loadapiData_searchdates();


  };

  usermaster() {
    this.navCtrl.push('UserMasterPage');
  };
  Calenmaster() {
    this.navCtrl.push('CalenPage');
  };

  openCommunication() {
    this.navCtrl.push('CommunicationListPage');
  }


  initateforcheckopenapp() {
    this.storage.set('checkFirstOpenApp', 1);
  }


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Create Student',
          handler: () => {
            this.navCtrl.push('ItemCreatePage');
          }
        },
        {
          text: 'View All',
          handler: () => {
            this.navCtrl.push('StudentMasterPage');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  subjectmaster() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Subject Master',
          handler: () => {
            this.navCtrl.push('SubjectMasterPage');
          }
        },
        //       {
        //       text: 'Assign Subject to Class',
        //     handler: () => {
        //     this.navCtrl.push('AssignSubjectPage');

        //  }
        // },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
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

  getUser() {
    this.storage.get('user').then((val) => {
      if (val != null) {
        console.log(val);
        this.user = val.user;
        console.log(this.user.name);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.getUser();
    this.initateforcheckopenapp();
  }


}
