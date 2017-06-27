import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController, NavController, AlertController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public loginSelected: Boolean = false
  public regisSelected: Boolean = false

  public loading: any

  constructor(
    public navCtrl: NavController, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private afAuth: AngularFireAuth, 
    private storage: Storage, 
    private firebase: AngularFireDatabase,
	  private facebook: Facebook
    ) {
    }
  setLoginState(){
    this.storage.set('isLoggedin', true)
  }
  signUp(form:any){
    if(form.password === form.password2){
      this.loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: 'Please wait...',
        dismissOnPageChange: true
      });
      this.loading.present();
      this.afAuth.auth
        .createUserWithEmailAndPassword(form.email, form.password)
        .then(res=>{
          this.firebase.database.ref('users').child(res.uid)
            .set({ name: form.name, friends: [{ uid: res.uid, name: form.name}], rooms: ['0']})
            .then(()=>{
              this.setLoginState()
            })
        },err=>{
          let alert = this.alertCtrl.create({
            title: 'Register failed !',
            subTitle: err.message,
            buttons: ['OK']
          });
          alert.present();
          this.loading.dismiss()
      })
    }else{
      let alert = this.alertCtrl.create({
        title: 'Register failed !',
        subTitle: 'Password does not match the confirm password',
        buttons: ['OK']
      });
      alert.present();
    }
  }
  signInWithEmail(form:any){
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
    this.afAuth.auth
      .signInWithEmailAndPassword(form.email, form.password)
      .then(res=>{
        this.setLoginState()
      },err=>{
        let alert = this.alertCtrl.create({
          title: 'Login failed !',
          subTitle: err.message,
          buttons: ['OK']
        });
        alert.present();
        this.loading.dismiss()
      })
  }
  signInWithFacebook(){
    this.facebook.login(['email']).then( (response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken)
      this.afAuth.auth
        .signInWithCredential(facebookCredential)
        .then(res => {
          this.firebase.database.ref('users').child(res.uid).once('value')
          .then(snapshot => {
            if(snapshot.val() != null){
              this.setLoginState()
            }else{
              this.firebase.database.ref('users').child(res.uid)
                .set({ name: res.displayName, friends: [{ uid: res.uid, name: res.displayName}], rooms: ['0']})
                .then(()=>{
                  this.setLoginState()
                })
            }
          })
        }).catch(err=> {
          let alert = this.alertCtrl.create({
            title: 'Login failed !',
            subTitle: err.message,
            buttons: ['OK']
          });
          alert.present();
        })
    })
  }
  signInWithGoogle(){
    
  }
}
