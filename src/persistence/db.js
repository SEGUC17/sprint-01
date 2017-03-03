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

  drop() {
    this.db.dropDatabase();
  }
}

module.exports = Database;
