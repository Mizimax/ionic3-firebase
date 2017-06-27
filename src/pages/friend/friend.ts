import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-friend',
  templateUrl: 'friend.html'
})
export class FriendPage {

  public friends
  private loading: any

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private afDb : AngularFireDatabase, 
    private afAuth: AngularFireAuth
    ) {
      this.loading = this.loadingCtrl.create({
        spinner: 'crescent',
        dismissOnPageChange: true
      });
      this.loading.present();
      let user = afAuth.auth.currentUser
      let userData = afDb.database.ref('users/'+ user.uid +'/friends')
      userData.on('value', snap=>{
        this.friends = snap.val()
        this.loading.dismiss()
      })
  }
}
