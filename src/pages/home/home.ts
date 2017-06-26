import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private afAuth: AngularFireAuth, private appCtrl: App, private storage: Storage) {
  }
  signOut(){
    this.afAuth.auth.signOut().then(()=>{
      this.storage.set('isLoggedin',false).then(()=>{
        this.appCtrl.getRootNav().setRoot(LoginPage)
      })
    })
  }
}
