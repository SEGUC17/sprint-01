import mongoose from 'mongoose';
import config from '../config/main';
import Business from './models/business';

export default class Database {
  /** Construction, Connection & Destruction */

  constructor() {
    this.config = config.database;
    mongoose.Promise = Promise;
    return this;
  }

  connect() {
    return mongoose.connect(this.config.uri);
  }

  drop() {
    mongoose.connection.db.dropDatabase();
  }

  /** Businesses */

  insertOneBusiness(business) {
    return new Business(business).save();
  }

  insertBusinesses(businesses) {
    return Business.create(businesses);
  }

  getBusinessesCount() {
    return Business.count().exec();
  }

  getAllBusinesses() {
    return Business.find().populate('owner').exec();
  }

  getBusinessById(_id) {
    return Business.findById(_id).exec();
  }

  searchBusinesses(query) {
    return Business.find(query).exec();
  }

  updateBusinessById(_id, updates) {
    return Business.findByIdAndUpdate(_id, updates, { new: true }).exec();
  }

  deleteBusinessById(_id) {
    return Business.findByIdAndRemove(_id).exec();
  }
}
