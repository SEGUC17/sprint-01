import mongoose from 'mongoose';
import _ from 'lodash';

import config from '../constants/config';

import User from './models/user';
import Business from './models/business';
import Activity from './models/activity';
import ActivityType from './models/activityType';

import errors from '../constants/errors'


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
    return new Promise((resolve, reject)=>{
      User.findOne({ username }).exec()
      .then((user)=>{
        if(_.isEmpty(user)) 
          reject(errors.USER_NOT_FOUND);
        
        resolve(user);
      })
      .catch((err)=> reject(errors.INTERNAL_SERVER_ERROR) )

    })
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
  
  getBusinessOfActivity(activityId) {

    return new Promise((resolve, reject)=>{
      Business.findOne({ activities:activityId, isVerified: true}).exec()
      .then((business)=>{
          resolve(business);

      })
    })
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

  /** Activities  */
  
  insertOneActivity(activity) {
    return Activity.create(activity);
  }

  insertActivities(activities) {
    return Activity.create(activities);
  }

  getActivitiesCount() {
    return Activity.count().exec();
  }

  getAllActivities() {
    return Activity.find().exec();
  }

  getActivityById(_id) {
    return new Promise((resolve, reject) => {
      Activity.findById(_id).exec()
        .then((activity)=>{
          
          if (_.isEmpty(activity)) {
            reject(errors.ACTIVITY_NOT_FOUND);
          } 
          resolve(activity);
        })
        .catch(()=> reject(errors.INTERNAL_SERVER_ERROR));
      })
  }

  searchActivities(query) {
    return Activity.find({ ...query, isVerified: false }).exec();
  }

  updateActivityById(_id, updates) {
    return Activity.findOneAndUpdate(_id, updates, { new: true }).exec();
  }

  deleteActivityById(_id) {
    return Activity.findOneAndRemove({ _id, isVerified: false }).exec();
  }

  /** Activities Booking  */

  getActivityBookingById(activityId, bookingId) {
    return new Promise((resolve, reject) => {
      this.getActivityById(activityId)
      .then((activity)=>{
        let booking = activity.bookings.id(bookingId);
        if (_.isEmpty(booking)) {
          reject(errors.BOOKING_NOT_FOUND);
        } 
        resolve(booking);
      })
      .catch((error)=> reject(error))
      })      
  }

  updateActivityBookingById(username, activityId, bookingId, updates) {
    return new Promise((resolve, reject) => {
      this.getActivityById(activityId)
        .then((activity)=>this.isRightfulActivityOwner(username,activityId))      
        .then(()=>{
          let set = Object.keys(updates).reduce((acc, cur)=>{acc['bookings.$.' + cur] = updates[cur]; return acc;}, {});
          Activity.findOneAndUpdate({_id: activityId, "bookings._id": bookingId}, {$set:set}, {new: true}).exec()
          .then((activity)=> resolve(activity.bookings.id(bookingId)))
          .catch((errors)=> reject(errors.INTERNAL_SERVER_ERROR));

        })
        .catch((error)=> reject(error) )

    })
  }

  insertBooking (activityId, bookingDoc) {
    let bookingIndex;
    return new Promise((resolve, reject) => {
      this.getActivityById(activityId)
      .then((activity)=>{
        bookingIndex = activity.bookings.push(bookingDoc)-1;
        return activity.save();
      })
      .then((activity)=>resolve(activity.bookings[bookingIndex]))
      .catch((error)=> reject(error))
    })
    
  }
  
  verifyBooking (username, activityId, bookingId) {
    
    return new Promise((resolve, reject) => {
      this.updateActivityBookingById(username, activityId, bookingId, {isConfirmed:true})
      .then((booking)=>resolve(booking))
      .catch((error)=> reject(error))
    })
    
  }
  
  deleteActivityBookingById(username, activityId, bookingId, updates) {
    return new Promise((resolve, reject) => {
      this.getActivityById(activityId)
        .then((activity)=> this.isRightfulActivityOwner(username,activityId) )
        .then(()=>this.getActivityById(activityId))
        .then((activity)=>{
          let booking = activity.bookings.id(bookingId);
          if(_.isEmpty(booking)) reject(errors.BOOKING_NOT_FOUND);
          booking.remove();
          return activity.save();
        })
        .then( (activity)=> resolve() )
        .catch( (error)=> reject(error) )

    })
  }

  isRightfulActivityOwner(username, activityId) {
    let activityBusiness;
    return new Promise((resolve, reject) => {
      this.getBusinessOfActivity(activityId)
      .then((business)=> {
        activityBusiness = business;
        return this.getUserByUsername({username});
      })
      .then((user)=>{
        if(activityBusiness.owner.toString() === user._id.toString())
          resolve();
        reject(errors.UNRIGHTFUL_ACTIVITY_OWNER);
      })

      .catch((error)=>reject(error));

    });
  }

  /** Activities Types  */

  insertOneActivityType(activityType) {
    return new Promise((resolve, reject)=>{
      ActivityType.create(_.extend(activityType, {isConfirmed:true}))
      .then((activityType)=>resolve(activityType))
      .catch((error)=>reject(errors.BAD_REQUEST(error.message)))
    })
    return 
  }

  getActivitiesCount() {
    return ActivityType.count().exec();
  }

  getAllActivityTypes() {
    return ActivityType.find({isConfirmed:true}).exec();
  }

  getActivityTypeById(_id) {
    return new Promise((resolve, reject) => {
      ActivityType.findById(_id).exec()
        .then((activityType)=>{
          
          if (_.isEmpty(activityType)) {
            reject(errors.ACTIVITY_TYPE_NOT_FOUND);
          } 
          resolve(activityType);
        })
        .catch(()=> reject(errors.INTERNAL_SERVER_ERROR));
      })
  }

  updateActivityTypeById(_id, updates) {
    return ActivityType.findOneAndUpdate(_id, updates, { new: true }).exec();
  }

  deleteActivityTypeById(_id) {
    return ActivityType.findOneAndRemove({ _id, isConfirmed: false }).exec();
  }
}
