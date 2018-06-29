import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
   activePage: any = '';

  rootPage: any = 'LoginPage';

  pages: Array<{title: string, component: any}>;

  constructor(private storage: Storage,public platform: Platform,public events: Events, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    var SignOut = { title: 'SignOut', component: "LoginPage"};
    var Register = { title: 'Register', component: "RegisterPage"};

       events.subscribe('user:created', (user) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      this.activePage = user;
      if(this.activePage=="LoginPage"){
          this.pages=[];
          this.pages.push(Register);
      }else{
      this.pages=[];
      this.pages.push(SignOut);
      }
    
    });

    // used for an example of ngFor and navigation
    

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
     
    });
  }



  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
