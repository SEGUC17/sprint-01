const { MongoClient } = require('mongodb');

class Database {
  constructor(config) {
    this.db = {};
    this.config = config;
    return this;
  }

  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.config.uri, (err, db) => {
        if (err) reject(err);
        this.db = db;
        resolve(this);
      });
    });
  }

  /** Businesses */

  getAllBusinesses() {
    return new Promise((resolve, reject) => {
      this.db.collection('businesses').find({})
        .toArray((err, data) => {
          if (err) reject(err);
          resolve(data);
        });
    });
  }

  searchBusinesses(query) {
    return new Promise((resolve, reject) => {
      this.db.collection('businesses').find(query)
        .toArray((err, data) => {
          if (err) reject(err);
          resolve(data);
        });
    });
  }

  getOneBusiness({ _id }) {
    return new Promise((resolve, reject) => {
      this.db.collection('businesses').findOne({
        _id
      }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  modifyOneBusiness({ _id }, modifications) {
    return new Promise((resolve, reject) => {
      this.db.collection('businesses').findAndModify({
        _id
      }, [], {
          $set: modifications
        }, {}, (err, data) => {
          if (err) reject(err);
          resolve(data);
        });
    });
  }

  deleteOneBusiness({ _id }) {
    return new Promise((resolve, reject) => {
      this.db.collection('businesses').deleteOne({
        _id
      }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  drop() {
    this.db.dropDatabase();
  }
}

module.exports = Database;
