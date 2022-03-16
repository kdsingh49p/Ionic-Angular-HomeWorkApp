import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, setTestabilityGetter } from '@angular/core';
import { Storage } from '@ionic/storage';
/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string = 'http://websitemastersindia.com/api/api/v1';
  //url: string = 'http://localhost/school_erp/api/v1';
  rawurl:string= 'http://localhost/school_erp/api/v1';
  db_connect:any;
  constructor(public http: HttpClient, public storage:Storage) {

  }
  getDbConn(){
    return new Promise((resolve, reject) => {
      this.storage.get('user').then((DbinUser:any) => {
        if(DbinUser){
          resolve(DbinUser.dbDetail);
        }else{
          resolve(false);
        }
      });
    });
  }
  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
    console.log('test');
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests

    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {

        reqOpts.params = reqOpts.params.set(k, params[k]);
       }
    }
    

      return this.http.get(this.url + '/' + endpoint, reqOpts);      
 }

  post(endpoint: string, body: any, reqOpts?: any) {
      return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }
   
  login(endpoint: string, body: any, reqOpts?: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/' + endpoint, body, reqOpts).subscribe(data =>{
        resolve(data);
      }, err=>{
        resolve(err);
      });
    });
  }

  rawGet(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
         reqOpts = {
          params: new HttpParams()
        };
      }
  
      // Support easy query params for GET requests
  
      if (params) {
        reqOpts.params = new HttpParams();
        for (let k in params) {
  
          reqOpts.params = reqOpts.params.set(k, params[k]);
         }
      }
       return this.http.get(this.rawurl + '/' + endpoint, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
       params: new HttpParams()
     };
   }

   // Support easy query params for GET requests
   var params = reqOpts;
   if (params) {
     reqOpts.params = new HttpParams();
     for (let k in params) {

       reqOpts.params = reqOpts.params.set(k, params[k]);
      }
   }
    return this.http.put(this.url + '/' + endpoint+'/'+body.id, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
       params: new HttpParams()
     };
   }

   // Support easy query params for GET requests
   var params = reqOpts;
   if (params) {
     reqOpts.params = new HttpParams();
     for (let k in params) {

       reqOpts.params = reqOpts.params.set(k, params[k]);
      }
   }
    return this.http.delete(this.url + '/' + endpoint+'/'+reqOpts.id, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }
}
