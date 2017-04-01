import { MongoClient } from 'mongodb';

export default class Database {
  /** Construction, Connection & Destruction */

  constructor(config) {
    this.db = {};
    this.config = config;
    return this;
  }

  connect() {
    return new Promise((resolve, reject) => {
      MongoClient
        .connect(this.config.uri, (err, db) => {
          if (err) reject(err);
          this.db = db;
          resolve(this);
        });
    });
  }

  drop() {
    this.db.dropDatabase();
  }

  /** Businesses */

  insertOneBusiness(business) {
    return new Promise((resolve, reject) => {
      this.db.collection('businesses')
        .insertOne(business, ((err, data) => {
          if (err) reject(err);
          resolve(data.ops[0]);
        }));
    });
  }

  insertBusinesses(businesses) {
    return new Promise((resolve, reject) => {
      this.db.collection('businesses')
        .insert(businesses, ((err, data) => {
          if (err) reject(err);
          resolve(data.ops);
        }));
    });
  }

  getAllBusinesses() {
    return new Promise((resolve, reject) => {
      this.db.collection('businesses')
        .find({}).toArray((err, data) => {
          if (err) reject(err);
          resolve(data);
        });
    });
  }

  getBusinessesCount() {
    return new Promise((resolve, reject) => {
      this.db.collection('businesses')
        .find({}).count((err, data) => {
          if (err) reject(err);
          resolve(data);
        });
    });
  }

  searchBusinesses(query) {
    return new Promise((resolve, reject) => {
      this.db.collection('businesses')
        .find(query).toArray((err, data) => {
          if (err) reject(err);
          resolve(data);
        });
    });
  }

  getOneBusiness({ _id }) {
    return new Promise((resolve, reject) => {
      this.db.collection('businesses')
        .findOne({ _id }, (err, data) => {
          if (err) reject(err);
          resolve(data);
        });
    });
  }

  modifyOneBusiness({ _id }, edits) {
    return new Promise((resolve, reject) => {
      this.db.collection('businesses')
        .findAndModify({ _id }, [],
        { $set: edits }, { new: true }, (err, data) => {
          if (err) reject(err);
          resolve(data.value);
        });
    });
  }

  deleteOneBusiness({ _id }) {
    return new Promise((resolve, reject) => {
      this.db.collection('businesses')
        .findAndModify({ _id }, [],
        {}, { remove: true }, (err, data) => {
          if (err) reject(err);
          resolve(data.value);
        });
    });
  }
}
