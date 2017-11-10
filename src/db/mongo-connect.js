/**
 * This is a wrapper for the NodeJS MongoDB driver
 */
 import MongoClient from 'mongodb';

//This is a singleton class
let _instance = null;

export default class MongoConnect {
    constructor() {
        if (_instance === null) _instance = this;

        this.db = null;

        return _instance;
    }

    //Open the connection using the specified uri
    init(uri) {
        MongoClient.connect(uri).then(db => {
            this.db = db;
        }).catch(err => { return console.error(err); });
    }

    //C
    create(collection, object) {
        this.db.collection(collection).save(object, (err, result) => {
            if (err) return console.error(err);

            console.log('saved: ' + object + ' to collection: ' + collection);
        });
    }

    //R
    read(collection, keyValue) {
        return this.db.collection(collection).findOne(keyValue);
    }

    //U
    update(collection, keyValue, newObj) {
        this.db.collection(collection).findOneAndUpdate(keyValue, newObj, {
            upsert: true
        }, (err, r) => {
            if (err) return console.error(err);
        });
    }
}