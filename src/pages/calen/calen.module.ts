import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalenPage } from './calen';

@NgModule({
  declarations: [
    CalenPage,
  ],
  imports: [
    IonicPageModule.forChild(CalenPage),
  ],
})
export class CalenPageModule {}
