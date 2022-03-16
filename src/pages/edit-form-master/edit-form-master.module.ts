import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditFormMasterPage } from './edit-form-master';

@NgModule({
  declarations: [
    EditFormMasterPage,
  ],
  imports: [
    IonicPageModule.forChild(EditFormMasterPage),
  ],
})
export class EditFormMasterPageModule {}
