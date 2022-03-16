import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';
import { FirstRunPage, MainPage } from '../pages/pages';
import { Settings } from '../providers/providers';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { SplashPage } from '../pages/splash/splash';
import { Push, PushObject, PushOptions } from '@ionic-native/push';



@Component({
  templateUrl: 'app.html',
})
export class MyApp {

  rootPage: string;
  user:any = {};
  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Signup', component: 'SignupPage' },
    { title: 'Welcome', component: 'WelcomePage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Cards', component: 'CardsPage' },
    { title: 'Content', component: 'ContentPage' },
    { title: 'Login', component: 'LoginPage' },
    { title: 'Master Detail', component: 'ListMasterPage' },
    { title: 'Menu', component: 'MenuPage' },
    { title: 'Settings', component: 'SettingsPage' },
    { title: 'Search', component: 'SearchPage' }
    
  ]

  constructor(private push: Push, private translate: TranslateService, platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen,private storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
     
      this.pushSetup();

    });
     


    this.initTranslate();
    this.configRoutePageFromStorage();
    this.storage.get('user').then((val) => {
      if(val!=null){
        this.user = val.user;
      }else{
        this.user = false;
      }
      
  });
  }
  pushSetup(){
    const options: PushOptions = {
      android: {
        senderID:'53259811970'
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      },

   };
   
   const pushObject: PushObject = this.push.init(options);
   
   
   pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
   
   pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));
   
   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }
  configRoutePageFromStorage(){
    
    this.rootPage = 'SplashPage';    
  }
  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }
  logout(){
    this.storage.remove('user');
    this.storage.set('rootPage', 'WelcomePage').then((data) =>{
      this.nav.setRoot('WelcomePage');
      console.log('logout');
    });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
