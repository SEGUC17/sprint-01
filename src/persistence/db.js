import mongoose from 'mongoose';
import config from '../constants/config';
import User from './models/user';
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

  /** Helpers */

  obscureMongooseObjectPassword(object) {
    return { ...object.toObject(), password: undefined };
  }

  /** Users */

  getUserByUsername({ username }) {
    return User.findOne({ username }).exec();
  }

  /** Clients */

  insertOneClient(client) {
    return User.create({ ...client, isAdmin: false })
      .then(createdClient => this.obscureMongooseObjectPassword(createdClient));
  }

  insertClients(clients) {
    return User.create(clients.map(client => ({ ...client, isAdmin: false })))
      .then(createdClients => createdClients.map(this.obscureMongooseObjectPassword));
  }

  getClientsCount() {
    return User.count({ isAdmin: false }).exec();
  }

  getAllClients() {
    return User.find({ isAdmin: false }).select('-password').exec();
  }

  getClientById(_id) {
    return User.findOne({ _id, isAdmin: false }).select('-password').exec();
  }

  searchClients(query) {
    return User.find({ ...query, isAdmin: false }).select('-password').exec();
  }

  updateClientById(_id, updates) {
    return User.findOneAndUpdate({ _id, isAdmin: false }, updates, { new: true }).select('-password').exec();
  }

  deleteClientById(_id) {
    return User.findOneAndRemove({ _id, isAdmin: false }).select('-password').exec();
  }

  /** Admins */

  insertOneAdmin(admin) {
    return User.create({ ...admin, isAdmin: true })
      .then(createdAdmin => this.obscureMongooseObjectPassword(createdAdmin));
  }

  insertAdmins(admins) {
    return User.create(admins.map(admin => ({ ...admin, isAdmin: true })))
      .then(createdAdmins => createdAdmins.map(this.obscureMongooseObjectPassword));
  }

  getAdminsCount() {
    return User.count({ isAdmin: true }).exec();
  }

  getAllAdmins() {
    return User.find({ isAdmin: true }).select('-password').exec();
  }

  getAdminById(_id) {
    return User.findOne({ _id, isAdmin: true }).select('-password').exec();
  }

  searchAdmins(query) {
    return User.find({ ...query, isAdmin: true }).select('-password').exec();
  }

  updateAdminById(_id, updates) {
    return User.findOneAndUpdate({ _id, isAdmin: true }, updates, { new: true }).select('-password').exec();
  }

  deleteAdminById(_id) {
    return User.findOneAndRemove({ _id, isAdmin: true }).select('-password').exec();
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
    return Business.find({ isVerified: true }).exec();
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
    return new Promise((resolve, reject) => {
      this.getBusinessById(businessId)
        .then((business)=>{
          
          if (ownerId === business.owner.toString()) return resolve();
          
          return reject();

        })
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
    return Business.find({ isVerified: false }).exec();
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
