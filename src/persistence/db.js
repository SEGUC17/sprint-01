import {MongoClient} from 'mongodb';
import { mongoose } from 'mongoose'
import config from '../config/main';

const Business = require('./models/business.js');

export default class Database {
    /** Construction, Connection & Destruction */

    constructor() {
        this.db = {};
        this.config = config.database;
        return this;
    }

    connect() {
        return new Promise((resolve, reject) => {

                mongoose.connect(this.config.uri).then(
                    () => {
                        this.db = mongoose;
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
                var record = new Business(business);
                rescord.save((err) => {
                    if (err) reject(err);
                    resolve(record);
                });
            });
        }

        insertBusinesses(businesses) {
            return new Promise((resolve, reject) => {
                businesses.forEach((business) => {
                    var record = new Business(business);
                    rescord.save((err) => {
                        if (err) reject(err);
                        resolve(record);
                    });
                });
            });
        }

        getAllBusinesses() {
            return new Promise((resolve, reject) => {
                Business.find({}, (err, data) => {
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
                Business.find({
                    query
                }, (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });
        }

        getOneBusiness({
            _id
        }) {
            return new Promise((resolve, reject) => {
                Business.findById(_id, (err, data) => {
                    if (err) reject(err);
                    resolve(data);

                });
            });
        }

        modifyOneBusiness({
            _id
        }, edits) {
            return new Promise((resolve, reject) => {

                Business.findByIdAndUpdate(_id, edits, (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });
        }

        deleteOneBusiness({
            _id
        }) {
            return new Promise((resolve, reject) => {
                Business.findByIdAndRemove(_id, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        }
    }
