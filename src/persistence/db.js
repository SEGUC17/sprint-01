import {
    MongoClient
} from 'mongodb';
var mongoose = require('mongoose');
import config from '../config/main';

var Business = require('./models/business');

export default class Database {
    /** Construction, Connection & Destruction */

    constructor() {
        this.db = {};
        this.config = config.database;
        mongoose.Promise = global.Promise;
        return this;
    }

    connect() {
        return new Promise((resolve, reject) => {
            mongoose.connect(this.config.uri).then(
                () => {
                    //  this.db = mongoose,connection.db;
                    resolve(this);
                },
                err => {
                    reject(err);
                }
            );
        })
    }


    drop() {
        mongoose.connection.db.dropDatabase((err) => {
            if (err) throw error;
        });
    }

    /** Businesses */

    insertOneBusiness(business) {
        return new Promise((resolve, reject) => {
            Business.collection.insert(business, (err, r) => {
                if (err) reject(err);
                resolve(r.ops[0]);
            })

        });
    }

    insertBusinesses(businesses) {
        return new Promise((resolve, reject) => {
            Business.collection.insertMany(businesses, (err, r) => {
                if (err) reject(err);
                resolve(r.ops);
            })
        });
    }

    getAllBusinesses() {
        return new Promise((resolve, reject) => {
            Business.collection.find({}).toArray((err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    getBusinessesCount() {
        return new Promise((resolve, reject) => {
            Business.count({}, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    searchBusinesses(query) {
        return new Promise((resolve, reject) => {
            Business.collection.find(
                query).toArray(
                (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
        });
    }

    getOneBusiness({
        _id
    }) {
        return new Promise((resolve, reject) => {
            Business.collection.findOne({
                _id
            }, (err, data) => {
                if (err) reject(err);
                //  console.log(data);
                resolve(data);

            });
        });
    }

    modifyOneBusiness(
        _id
    , edits) {
        return new Promise((resolve, reject) => {
            Business.findByIdAndUpdate(_id, edits, (err, data) => {
                if (err) reject(err);
                console.log(edits);
                console.log("============");
                console.log(data);
                resolve(data);
            });
        });
    }

    deleteOneBusiness({
        _id
    }) {
        return new Promise((resolve, reject) => {
            var record = this.getOneBusiness({
                _id
            })
            Business.findByIdAndRemove(_id, (err) => {
                if (err) reject(err);
                resolve(record);
            });
        });
    }
}
