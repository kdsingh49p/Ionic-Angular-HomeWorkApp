import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController } from 'ionic-angular';
import {Core} from '../../services/core';

import { Tab1Root } from '../pages';
import { Tab2Root } from '../pages';
import { Tab3Root } from '../pages';
import { Tab4Root } from '../pages';
import { Tab5Root } from '../pages';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;
  tab4Root: any = Tab4Root;
  tab1Title = " ";
  tab2Title = " ";
  tab3Title = " ";
  tab4Title = " ";
  public isStudent:any;
  public isStaff:any;
  constructor(public core:Core, public navCtrl: NavController, public translateService: TranslateService) {
    translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE']).subscribe(values => {
      

      this.tab1Title = 'Home';
      this.tab2Title = 'Notice';
      this.tab3Title = 'Contact';
      this.tab4Title = 'Feedback';
      console.log('isStudent');
      this.core.isStudent().then(status => {
        this.isStudent = status;
        if(this.isStudent){
          this.tab2Title = 'View Notice';
          this.tab2Root = Tab5Root;
        }
      });
      this.core.isStaff().then((status) => {
        this.isStaff = status;
      });
    });

  }

}
