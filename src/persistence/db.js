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
    return Business.create({ ...business, isVerified: true });
  }

  insertBusinesses(businesses) {
    return Business.create(businesses.map(business => ({ ...business, isVerified: true })));
  }

  getBusinessesCount() {
    return Business.count({ isVerified: true }).exec();
  }

  getAllBusinesses() {
    return Business.find({ isVerified: true }).populate('owner').exec();
  }

  getBusinessById(_id) {
    return Business.findOne({ _id, isVerified: true }).exec();
  }

  searchBusinesses(query) {
    return Business.find({ ...query, isVerified: true }).exec();
  }

  updateBusinessById(_id, updates) {
    return Business.findOneAndUpdate({ _id, isVerified: true }, updates, { new: true }).exec();
  }

  deleteBusinessById(_id) {
    return Business.findOneAndRemove({ _id, isVerified: true }).exec();
  }

  isRightfulBusinessOwner(ownerId, businessId) {
    return new Promise(async (resolve, reject) => {
      const business = await this.getBusinessById(businessId);
      if (ownerId === business.owner.toString()) return resolve();
      return reject();
    });
  }

  /** Business Registrations */

  insertOneBusinessRegistration(business) {
    return Business.create({ ...business, isVerified: false });
  }

  insertBusinessRegistrations(businesses) {
    return Business.create(businesses.map(business => ({ ...business, isVerified: false })));
  }

  getBusinessRegistrationsCount() {
    return Business.count({ isVerified: false }).exec();
  }

  getAllBusinessRegistrations() {
    return Business.find({ isVerified: false }).populate('owner').exec();
  }

  getBusinessRegistrationById(_id) {
    return Business.findOne({ _id, isVerified: false }).exec();
  }

  searchBusinessRegistrations(query) {
    return Business.find({ ...query, isVerified: false }).exec();
  }

  updateBusinessRegistrationById(_id, updates) {
    return Business.findOneAndUpdate({ _id, isVerified: false }, updates, { new: true }).exec();
  }

  deleteBusinessRegistrationById(_id) {
    return Business.findOneAndRemove({ _id, isVerified: false }).exec();
  }
}
