import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
 import { HomeWorkPage } from './home-work';
import { NgCalendarModule  } from 'ionic2-calendar';


@NgModule({
  declarations: [

    HomeWorkPage,
  ],
  imports: [
  	NgCalendarModule,
     IonicPageModule.forChild(HomeWorkPage),

  ],
})
export class HomeWorkPageModule {}
