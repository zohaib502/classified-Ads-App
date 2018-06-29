import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController  } from 'ionic-angular';
import {User} from '../../models/user';
import {AngularFireAuth} from 'angularfire2/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	user={} as User;

	
  constructor(public menu: MenuController,private ofauth:AngularFireAuth,public events: Events,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.menu.enable(false);
    console.log('ionViewDidLoad LoginPage');
    this.events.publish('user:created', "LoginPage");
  }
  register(){
  this.navCtrl.push('RegisterPage');
  }

    async login(user:User){
  	try{
  	const result= this.ofauth.auth.signInWithEmailAndPassword(user.email,user.password).then((res)=>{
      if(result){
      this.navCtrl.setRoot('HomePage');
    }
    }).catch((error)=>{
      console.log("Error="+JSON.stringify(error));
      if(error){
      console.log("Wrong Email and Password")
      }
    });
  	// if(result){
  	// 	this.navCtrl.setRoot('RegisterhomePage');
  	// }else{
  	// console.log("Invalid Username and password");
  	// }
  	// console.log(result);

  	}
  	catch(e){
  	console.log(e);
  	}
  	
  }

}
