import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController, NavController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs'

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
    private afAuth: AngularFireAuth, 
    private storage: Storage, 
    private firebase: AngularFireDatabase,
    ) {
    }
  goHome(){
    this.navCtrl.setRoot(TabsPage, {}, { animate: true, duration: 600 })
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
              this.goHome()
            })
        },err=>{
          console.log(err)
          this.loading.dismiss()
      })
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
        this.goHome()
      },err=>{
        console.log(err)
        this.loading.dismiss()
      })
  }
  signInWithFacebook(){
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => {
          this.firebase.database.ref('users').child(res.user.uid).once('value')
            .then(snapshot => {
              if(snapshot.val() != null){
                this.goHome()
              }else{
                this.firebase.database.ref('users').child(res.user.uid)
                .set({ name: res.user.displayName, friends: [{ uid: res.user.uid, name: res.user.displayName}], rooms: ['0']})
                .then(()=>{
                  this.goHome()
                })
              }
            })
        },err=> {
          console.log(err)
          this.loading.dismiss()
        })
  }
  signInWithGoogle(){
    
  }
}
