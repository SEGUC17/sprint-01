import mongoose from 'mongoose';
import _ from 'lodash';
import bcrypt from '../auth/bcrypt';

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

  getUserByUsername(username ) {
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
  
  validateUserPassword(username, password ) {
    return new Promise((resolve, reject)=>{
      this.getUserByUsername(username)
      .then((user) => {

        if (!bcrypt.compare(password, user.password)) {
          return reject(errors.PASSWORD_MISMATCH);
        }
        return resolve(user);
      })
      .catch((error)=>reject(error))

    })
  }

  /** Clients */

  insertOneClient(client) {
    return new Promise((resolve, reject)=>{
      User.create({ ...client, isAdmin: false })
      .then(createdClient => resolve(this.obscureMongooseObjectPassword(createdClient)))
      .catch(error=>reject(errors.BAD_REQUEST(errors.message)))
    })
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
    return new Promise((resolve, reject)=>{
      User.create({ ...admin, isAdmin: true })
      .then(createdAdmin => resolve(this.obscureMongooseObjectPassword(createdAdmin)))
      .catch(error=>reject(errors.BAD_REQUEST(errors.message)))
    })
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
  
  isBusinessOwner(username) {
    return new Promise((resolve, reject)=>{
      this.getBusinessByOwnerUsername(username)
      .then((business)=> resolve(business))
      .catch(()=>reject(errors.NOT_BUSINESS))

    }) 
  }

  NOT_BUSINESS

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
    return new Promise((resolve, reject)=>{
      Business.findOne({ _id, isVerified: true }).exec()
      .then((business)=>{
        if(_.isEmpty(business))
          return reject(errors.BUSINESS_NOT_FOUND);
        resolve(business);
      })
      .catch((error)=>reject(errors.BAD_REQUEST(error.message)))

    }) 
  }
  getBusinessByOwnerId(_id) {
    
    return new Promise((resolve, reject)=>{
      Business.findOne({ owner:_id, isVerified: true }).exec()
      .then((business)=>{
        if(_.isEmpty(business))
          return reject(errors.BUSINESS_NOT_FOUND);
        resolve(business);
      })
      .catch((error)=>reject(errors.BAD_REQUEST(error.message)))

    }) 
  }
  
  getBusinessByOwnerUsername(username) {
    return new Promise((resolve, reject)=>{
      this.getUserByUsername(username)
      .then((user)=>this.getBusinessByOwnerId(user._id))
      .then((business)=>resolve(business))
      .catch((error)=>reject(error))
    })
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

  addActivityToBusiness(businessId, activityId) {
    return new Promise((resolve, reject)=>{
      Business.findOneAndUpdate({ _id:businessId, isVerified: true }, { $push: { 'activities':activityId} }, { new: true }).exec()
      .then((business)=>{
        if(_.isEmpty(business))
          reject(errors.USER_NOT_FOUND)
        
        resolve(business)
      })
      .catch((error)=> reject(error))

    })
  }

  deleteBusinessById(_id) {
    return Business.findOneAndRemove({ _id, isVerified: true }).exec();
  }

  isRightfulBusinessOwner(username, businessId) {
    let userId; 
    return new Promise((resolve, reject) => {
      this.getUserByUsername(username)
      .then((user)=>{
        userId = user._id
        return getBusinessByOwnerId(userId);
      })
      .then((business)=>{

        if (userId.toString() === business.owner.toString()) 
          return resolve();
        
        return reject(errors.UNRIGHTFUL_BUSINESS_OWNER);
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
  
  insertOneActivity(activity, businessId) {
    let activityDoc; 
    return new Promise((resolve, reject)=>{
      Activity.create(activity)
      .then((activity)=>{
        activityDoc = activity; 
        return this.addActivityToBusiness(businessId, activity._id)
      })
      .then((business)=>{
        resolve(activityDoc);
      })
      .catch((error)=>reject(errors.BAD_REQUEST(error.errors)))

    })
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
    return new Promise((resolve, reject) => {
      Activity.find({name: { $regex: new RegExp(query, 'i') }}).exec()
      .then((activities)=> resolve(activities))
      .catch(()=>reject(errors.INTERNAL_SERVER_ERROR))
    });
  }

  updateActivityById(_id, updates) {
    return new Promise((resolve, reject) => {
      Activity.findOneAndUpdate(_id, updates, { new: true }).exec()
      .then((activity)=>{
        if(_.isEmpty(activity))
          reject(errors.ACTIVITY_NOT_FOUND);
        resolve(activity)
      })
      .catch(()=>reject(errors.INTERNAL_SERVER_ERROR))
    })
  }

  deleteActivityById(_id) {
    return new Promise((resolve, reject) => {
      Activity.findOneAndRemove({ _id}).exec()
      .then((activity)=>{
        if(_.isEmpty(activity))
          reject(errors.ACTIVITY_NOT_FOUND);
        resolve(null)
      })
      .catch(()=>reject(errors.INTERNAL_SERVER_ERROR))
    });
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

  updateActivityBookingById(activityId, bookingId, updates) {
    return new Promise((resolve, reject) => {
      this.getActivityById(activityId)
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
  
  confirmBooking (activityId, bookingId) {
    
    return new Promise((resolve, reject) => {
      this.updateActivityBookingById(activityId, bookingId, {isConfirmed:true})
      .then((booking)=>resolve(booking))
      .catch((error)=> reject(error))
    })
    
  }
  
  deleteActivityBookingById(activityId, bookingId) {
    return new Promise((resolve, reject) => {
      this.getActivityById(activityId)
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
        return this.getUserByUsername(username);
      })
      .then((user)=>{
        if(activityBusiness.owner.toString() === user._id.toString())
          resolve();
        reject(errors.UNRIGHTFUL_ACTIVITY_OWNER);
      })

      .catch((error)=>reject(errors.UNRIGHTFUL_ACTIVITY_OWNER));

    });
  }

  /** Activities Types  */

  insertOneActivityType(activityType) {
    return new Promise((resolve, reject)=>{
      ActivityType.create(activityType)
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
    return new Promise((resolve, reject)=>{
      ActivityType.findOneAndUpdate(_id, updates, { new: true }).exec()
      .then((activityType)=>{
        if (_.isEmpty(activityType))
          reject(errors.ACTIVITY_NOT_FOUND);
        else
          resolve(activityType)
      })

    })
  }


  deleteActivityTypeById(_id) { 
    //@NOTE: you are not deleting all activities that have this type .. so this maybe problematic
    return new Promise((resolve, reject)=>{
      this.getActivityTypeById(_id)
      .then(()=>ActivityType.findOneAndRemove({ _id}).exec())
      .then((activityType)=>{
        if(_.isEmpty(activityType))
          reject(errors.ACTIVITY_NOT_FOUND);
        resolve(null)
      })
      .catch((error)=>reject(error))
    }); 
  }


  getAllActivityTypesRequests() {
    return ActivityType.find({isConfirmed:false}).exec();
  }

}
