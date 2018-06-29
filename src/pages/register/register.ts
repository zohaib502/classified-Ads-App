import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {User} from '../../models/user';
import * as firebase from 'firebase';



@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

user={} as User;

  constructor(private ofauth:AngularFireAuth,public events: Events,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
		this.events.publish('user:created', "Register");
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(user:User){
  	try{
  	const result = this.ofauth.auth.createUserWithEmailAndPassword(user.email,user.password).then((res)=>{
  		let user = firebase.auth().currentUser;
  		user.sendEmailVerification();
  		this.navCtrl.setRoot('LoginPage');
  	});
  	console.log(result);
  	}
  	catch(e){
  	console.error(e);
  	}
  	
  }

}
