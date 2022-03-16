import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserMasterPage } from './user-master';

@NgModule({
  declarations: [
    UserMasterPage,
  ],
  imports: [
    IonicPageModule.forChild(UserMasterPage),
  ],
})
export class UserMasterPageModule {}
