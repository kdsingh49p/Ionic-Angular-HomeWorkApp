import { Injectable } from '@angular/core';
import { Api } from '../providers/api/api';
import { LoadingController, IonicPage, NavController, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


import 'rxjs/add/operator/map';

@Injectable()
export class Core {
   results: any;
   user:any;
   constructor(public api: Api, public toastCtrl: ToastController, public storage: Storage, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    
    }
    getUser(){
	  	  return new Promise((resolve, reject) => {

            this.storage.get('user').then((val) => {
                if(val!=null){
                    resolve(val.user);
                }else{
                    resolve(false);
                }
            });
        });
    }
    presenterrors(err){
        if(err.length>0){
            for (let index = 0; index < err.length; index++) {
                console.log(err[index].message);
                this.createToast(err[index].message);
                
            }
        }
    }

    isStudent(){
        return new Promise((resolve, reject) => {
            this.getUser().then((data:any) => {
                if(data!=null){
                    if(data.type=='student'){
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                }
            });
        });    
    }
    isStaff(){
        return new Promise((resolve, reject) => {
            this.getUser().then((data:any) => {
                if(data!=null){
                    if(data.type=='staff'){
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                }
            });
        });
    }

    createAlert(tit, buttonTitle='OK'){
        let alert = this.alertCtrl.create({
            title: tit,
            buttons: [buttonTitle]
          })
          alert.present();
    }
    createToast(title="Item Created Successfully", dur=3000){
        let toast = this.toastCtrl.create({
            message: title,
            duration: dur,
            position: 'top'
          });
          toast.present();
    }
    presentLoading(dismiss=0) {
    let loader = this.loadingCtrl.create({
        content: "Loading..",
        duration: 2000
    });
    if(dismiss){
        loader.dismiss();
    }
    loader.present();
    }    
}
