import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  @ViewChild('nav') nav;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen, 
    private storage: Storage,
    private afAuth: AngularFireAuth
    ) {
      afAuth.auth.onAuthStateChanged(user=>{
        if(user){
          this.nav.setRoot(TabsPage)
        }
        else{
          this.nav.setRoot(LoginPage)
        }
      })
      storage.get('isLoggedin').then(val=>{
        if(val)
          this.rootPage = TabsPage
        else
          this.rootPage = LoginPage
    })

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
