import jwt from '../../auth/jwt';
import errors from '../../constants/errors';

import Activity from '../../persistence/models/activity';
import User from '../../persistence/models/user';
import ActivityType from '../../persistence/models/activityType';
import Business from '../../persistence/models/business';

import mongoose from 'mongoose';
import _ from 'lodash';

let ObjectId = mongoose.Types.ObjectId;



export default ({ api, db }) => {
  /** List own activity's confirmed bookings (for business owners) */

  api.get('/activities/:id/bookings', (req, res) => {
    // Verify JWT validity
    jwt.verify(req)
    //get activity by id
    .then(()=> db.getActivityById(req.params.id))
    //get activity by id
    .then((activity) => { return res.status(200).json({ error: null, data: activity.bookings })})
    //return errors
    .catch((error)=>{ return res.status(error.status).json({ error: error.message, data: null }) })
  });

  /** View own activity's confirmed booking (for business owners) */

  api.get('/activities/:activityId/bookings/:bookingId', (req, res) => {
    // Verify JWT validity
    jwt.verify(req)
    .then(()=> db.getActivityBookingById(req.params.activityId, req.params.bookingId))
    .then((booking) => { return res.status(200).json({ error: null, data: booking }); })
    .catch((error)=>{ return res.status(error.status).json({ error: error.message, data: null }) })

  });

  /** Edit own activity's confirmed booking (for business owners) */

  api.put('/activities/:activityId/bookings/:bookingId', (req, res) => {
    // Verify JWT validity
    jwt.verify(req)
      .then((token)=> db.updateActivityBookingById(token.username, req.params.activityId, req.params.bookingId, req.body))
      .then((activity) => { return res.status(200).json({ error: null, data: activity })})
      .catch((error)=>{ return res.status(error.status).json({ error: error.message, data: null }) })
    
    // jwt.verify(req)
    //   .then((token) => {
    //     if (!token.isAdmin) {
    //       let activityId = ObjectId(req.params.activityId);
    //       let bookingId = ObjectId(req.params.bookingId);
          
    //       let set = Object.keys(req.body).reduce((acc, cur)=>{acc['bookings.$.' + cur] = req.body[cur]; return acc;}, {});

    //       CheckActivityOwnerPromise(token.username,activityId)
    //       .then(()=>{
    //         Activity.update({_id: activityId, "bookings._id": bookingId},{$set: set})
    //         .then((numAffected)=>{
    //             res.status(200).json({ error: null, data: numAffected});
    //         })
    //         .catch((error) => res.status(401).json({ error: error.message, data: null }))
    //       })
    //       .catch((error) => res.status(403).json({ error: errors.UNAUTHORIZED.message, data: null }))
          
    //     }
    //     else
    //       return res.status(403).json({ error: errors.NOT_BUSINESS.message, data: null });

    //   })
    //   .catch((err) =>  res.status(401).json({ error: errors.INVALID_TOKEN.message, data: null }) );
  });

  /** Delete own activity's confirmed booking (for business owners) */

  api.delete('/activities/:activityId/bookings/:bookingId', (req, res) => {
    jwt.verify(req)
      .then((token) => {
        if (!token.isAdmin) {

          let activityId = ObjectId(req.params.activityId);
          let bookingId = ObjectId(req.params.bookingId);
          
          CheckActivityOwnerPromise(token.username,activityId)
          .then(()=>{
            Activity.findById(activityId).exec()
            .then((activity)=>{
              
              activity.bookings.id(bookingId).remove();

              activity.save()
              .then((activity)=> res.status(200).json({ error: null, data: null}))
              .catch((error) => res.status(401).json({ error: error, data: null }))

            })
            .catch((error) => res.status(401).json({ error: error.message, data: null }))
          })
          .catch((error) => res.status(403).json({ error: errors.UNAUTHORIZED.message, data: null }))
          
        }
        else
          return res.status(403).json({ error: errors.NOT_BUSINESS.message, data: null });
      })
      .catch(() => res.status(401).json({ error: errors.INVALID_TOKEN.message, data: null }));
  });

  /** List own activity's booking requests (for business owners) */

  api.get('/activities/:id/booking-requests', (req, res) => {
    res.json({});
  });

  /** View own activity's booking request (for business owners) */

  api.get('/activities/:activityId/booking-requests/:bookingId', (req, res) => {
    res.json({});
  });

  /** Request an activity's booking (for clients) */

  api.post('/activities/:activityId/booking-requests', (req, res) => {
    res.json({});
  });

  /** Confirm own activity's booking request (for business owners) */

  api.put('/activities/:activityId/booking-requests/:bookingId/verify', (req, res) => {
    res.json({});
  });

  /** Discard own activity's booking request (for business owners) */

  api.delete('/activities/:activityId/booking-requests/:bookingId/verify', (req, res) => {
    res.json({});
  });

  let CheckActivityOwnerPromise = (businessUserName, activityId)=>{    
    return User.findOne({username:businessUserName}).exec()
    .then(user=> Business.findOne({owner:user._id}))
    .then(business=> {
      return new Promise((resolve, reject)=>{
        if(business.activites.indexOf(activityId) != -1)
          resolve();
        else
          reject();
      })
    })

  }
};
