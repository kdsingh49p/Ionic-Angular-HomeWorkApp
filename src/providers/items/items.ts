import { Injectable } from '@angular/core';
import { Item } from '../../models/item';
import { Api } from '../api/api';
import { Core } from '../../services/core';
import 'rxjs/add/operator/map';
import { CATCH_ERROR_VAR } from '@angular/compiler/src/output/abstract_emitter';
import { Storage } from '@ionic/storage';

@Injectable()
export class ItemsList {
   results: any;
   constructor(public storage:Storage, public api: Api, public core: Core) { }
	  query(page, params:any={}) {
	  		return new Promise(resolve => {
					this.api.getDbConn().then((db_connect:any) => {
						if(db_connect){
							console.log(db_connect);
							params.db_name = db_connect.db_name;
							params.db_password = db_connect.db_password;
							params.db_user = db_connect.db_user;
							}
							this.api.get(page, params).subscribe(result => {
								this.results  = result;
								 resolve(this.results);
						 },
							 error => { 
							 }
						 );
						});

		});
		}
		_serialize(obj, prefix='') {
				var str = [];
				for (var p in obj) {
				if (obj.hasOwnProperty(p)) {
				var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
				str.push(typeof v == "object" ? this._serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
				}
				}
				return str.join("&");
			}
	  add(page, item: Item) {
	  	  return new Promise((resolve, reject) => {
			this.api.getDbConn().then((db_connect:any) => {
				if(db_connect){
					console.log(db_connect);
					item.db_name =db_connect.db_name;
					item.db_password =db_connect.db_password;
					item.db_user =db_connect.db_user;
				}
				this.api.post(page, item).subscribe(
					res => {
						console.log(res);
						resolve(res);
					}, (err) => {
						if(err.error){
							console.log(err.error);
							this.core.presenterrors(err.error);							
						}
			        //reject(err);
				});
			});
		 });
	  };
	  
  	edit(page, item: Item) {
	  	  return new Promise((resolve, reject) => {
			this.api.getDbConn().then((db_connect:any) => {
				if(db_connect){
					console.log(db_connect);
					item.db_name =db_connect.db_name;
					item.db_password =db_connect.db_password;
					item.db_user =db_connect.db_user;
				}
				this.api.put(page, item, item).subscribe(
					res => {
						resolve(res);
					}, (err) => {
						reject(err);
				});
			});
		 });
  	};
  	delete(page, item: Item) {
  		return new Promise((resolve, reject) => {
			this.api.getDbConn().then((db_connect:any) => {
				if(db_connect){
					console.log(db_connect);
					item.db_name =db_connect.db_name;
					item.db_password =db_connect.db_password;
					item.db_user =db_connect.db_user;
				}
	  		this.api.delete(page, item).subscribe(
			    res => {
			    	console.log(res);
			        resolve(res);
			      }, (err) => {
			        reject(err);
				});
			});
		 });
  		
	}
	search(page,params:any={}) {
		
	  		return new Promise(resolve => {
				this.api.getDbConn().then((db_connect:any) => {
					if(db_connect){
						console.log(db_connect);
						params.db_name =db_connect.db_name;
						params.db_password =db_connect.db_password;
						params.db_user =db_connect.db_user;
					}
					this.api.get(page,params).subscribe(result => {
								this.results  = result;
								resolve(this.results);
						},error => { 
							}
						);
					});
				});
	  }
		access_code_verify(page, data: any){
			return new Promise(resolve => {
				this.api.getDbConn().then((db_connect:any) => {
					if(db_connect){
						console.log(db_connect);
						data.db_name =db_connect.db_name;
						data.db_password =db_connect.db_password;
						data.db_user =db_connect.db_user;
					}
			   this.api.rawGet(page,data)
			   .subscribe(result => {
			   	console.log(result);
			      resolve(result);
				},
			    error => { 
			    console.log(error);
			    }
			  );
			});
		});
		};
		getClasses(){
			return new Promise(resolve => {
				this.storage.get('stats').then((data:any) =>{
					if(data.class_list){
						resolve(data.class_list);
					}else{
						resolve(false);
					}
			  	});
		  	});
		}
		getSections(){
			this.storage.get('stats').then((data:any) =>{
				if(data.section_list){
					return data.section_list;
				}else{
					return false;
				}
			  });
		}
		getSubjects(){
			return new Promise(resolve => {
				this.storage.get('stats').then((data:any) =>{
					if(data.section_list){
						resolve(data.section_list);
					}else{
						resolve(false);
					}
				});
			});
		}
		getStaff(){
			this.storage.get('stats').then((data:any) =>{
				if(data.staff_list){
					return data.staff_list;
				}else{
					return false;
				}
			  });
		}
		getUser(){
			this.storage.get('stats').then((data:any) =>{
				if(data.user_list){
					return data.user_list;
				}else{
					return false;
				}
			  });
		}
		post(page, data: any) {
			return new Promise((resolve, reject) => {
				this.api.getDbConn().then((db_connect:any) => {
					if(db_connect){
						console.log(db_connect);
						data.db_name =db_connect.db_name;
						data.db_password =db_connect.db_password;
						data.db_user =db_connect.db_user;
					}
			this.api.post(page, data).subscribe(
				res => {
						resolve(res);
					}, (err) => {
						reject(err);
				});
			});
	 });
	};	

}
