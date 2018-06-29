import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';

/**
 * Generated class for the RegisterhomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public menu: MenuController,public navCtrl: NavController,public events: Events, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.menu.enable(true);
    console.log('ionViewDidLoad RegisterhomePage');
    this.events.publish('user:created', "Home");
  }

}
