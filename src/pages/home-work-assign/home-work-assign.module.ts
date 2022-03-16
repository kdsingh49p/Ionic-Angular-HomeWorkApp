import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeWorkAssignPage } from './home-work-assign';

@NgModule({
  declarations: [
    HomeWorkAssignPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeWorkAssignPage),
  ],
})
export class HomeWorkAssignPageModule {}
