import { Component } from '@angular/core';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public isSelected: Boolean = false

  constructor() {
  }
  signInWithEmail(){
  	this.isSelected = true;
  }
  signInWithFacebook(){

  }
  signInWithGoogle(){
  	
  }
}
