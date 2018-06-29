import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/toPromise';

declare var window: any;

@Injectable()
export class DatabaseProvider {
    db: any;
    currentPlatform: any;
    fileName: any = 'Database';
    // Increase CURRENTDBVERSION if any new script is added. This should be equal to the latest script number added. (Ex: emerson_v1.txt)
    private CURRENTDBVERSION: number = 1;
    public dbName = 'emerson.sqlite';
    constructor(public http: Http, private platform: Platform, private sqlite: SQLite) {
    }

    getDB() {
        if (!this.db) {
          //  this.logger.log(this.fileName, 'getDB', "Opening DB...");
            if (this.platform.is('cordova')) {
                this.db = window.sqlitePlugin.openDatabase({ name: this.dbName, location: 'default',androidDatabaseImplementation:2 });
            } else {
                this.db = window.openDatabase(this.dbName, '1', 'Emerson', 1024 * 1024 * 100);
            }
        }
        return this.db;
    }

    initDB() {
        return new Promise((resolve, reject) => {
           // this.logger.log(this.fileName, 'getDB', "Creating/Opening DB...");
            if (this.platform.is('cordova')) {
                this.sqlite.create({
                    name: this.dbName,
                    location: 'default'
                    
                }).then((db: SQLiteObject) => {
                   // this.logger.log(this.fileName, 'initDB', "DB Successfully Create/Open");
                    this.db = db;
                    this.loadScript(this.http, db).then(() => {
                     //   this.logger.log(this.fileName, 'initDB', "Script Loaded Successfully");
                        resolve(true);
                    });
                }).catch(e => {
                  //  this.logger.log(this.fileName, 'initDB', "Error: " + JSON.stringify(e));
                    reject(e);
                });
            } else {
                this.db = window.openDatabase(this.dbName, '1', 'Emerson', 1024 * 1024 * 100);
              //  this.logger.log(this.fileName, 'initDB', "DB Successfully Create/Open");
                //this.loadScript(this.http, this.db);
                resolve(true);
            }
        });
    }

    loadScript(http: Http, database) {
        return new Promise((resolve, reject) => {
            this.getDBScript(database).then((dbScript: any[]) => {
                if (dbScript.length > 0) {
                    database.sqlBatch(dbScript).then(() => {
                      //  this.logger.log(this.fileName, 'loadScript', 'Populated database OK');
                        resolve(true);
                    }).catch(e => {
                    //    this.logger.log(this.fileName, 'loadScript', 'ERROR while executing sql batch: ' + e.message);
                        reject(e);
                    });
                } else {
                   // this.logger.log(this.fileName, 'loadScript', 'Script Already Loaded');
                    resolve(true);
                }
            });
        });
    }

    getAppDbVersion(database) {
        return new Promise((resolve, reject) => {
            database.transaction((tx) => {
                var version = 0;
                var checkIfExistQuery = "SELECT name FROM sqlite_master WHERE type='table' AND name='CURRENTDATABASEVERSION'";
                tx.executeSql(checkIfExistQuery, [], ((tx, rs) => {
                    if (rs.rows.length != 0) {
                        var query = "Select DATABASEVERSION from CURRENTDATABASEVERSION";
                        tx.executeSql(query, [], ((tx, rs) => {
                            if (rs.rows.length != 0) {
                                version = rs.rows.item(0).DATABASEVERSION;
                            }
                            resolve(version);
                        }), ((tx, error) => {
                           // this.logger.log(this.fileName, 'getAppDbVersion', 'Error: ' + error.message);
                            resolve(version);
                        }));
                    } else {
                        resolve(version);
                    }
                }), ((tx, error) => {
                 //   this.logger.log(this.fileName, 'getAppDbVersion', 'Error: ' + error.message);
                    reject(error);
                }));
            });
        });
    }

    getDBScript(database) {
        return new Promise((resolve, reject) => {
            this.getAppDbVersion(database).then((appDBversion: number) => {
                var promise = [];
                var dbScript = [];
                for (var i = appDBversion + 1; i <= this.CURRENTDBVERSION; i++) {
                    promise.push(this.http.get('assets/data/emerson_v' + i + '.txt').map((res: any) => res.text()).toPromise());
                }
                if (promise.length > 0) {
                    Promise.all(promise).then(allResult => {
                        var dbScript = [];
                        for (var k in allResult) {
                            var scriptArr = allResult[k].split(';');
                            for (var i = 0; i < scriptArr.length - 1; i++) {
                                var query = scriptArr[i].replace(/(?:\r\n|\r|\n)/g, '');
                                if (query != '') {
                                    dbScript.push(query);
                                }
                            }
                        }
                        resolve(dbScript);
                    }).catch(error => {
                     //   this.logger.log(this.fileName, 'getDBScript', 'Error: ' + error.message);
                        reject(error);
                    });
                } else {
                    resolve(dbScript);
                }
            });
        });
    }

}
