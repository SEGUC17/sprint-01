import jwt from '../../auth/jwt';
import errors from '../../validation/errors';

import Activity from '../../persistence/models/activity';
import mongoose from 'mongoose';

let ObjectId = mongoose.Types.ObjectId;

export default ({ api, db }) => {
  // List own activity's confirmed bookings (for businesses)
  api.get('/activities/:id/bookings', (req, res) => {
    jwt.verify(req)
      .then((token) => {
        if (jwt.isBusiness(token)) {

          let activityId = ObjectId(req.params.id);
          Activity.findById(activityId).exec()
          .then((activity)=>{
            return res.status(200).json({ error: null, data: activity.bookings||[]}) 
          })
          .catch((error) =>{
            res.status(401).json({ error: errors.activityNotFound.message, data: null });
          })
          
        }
        else
          return res.status(403).json({ error: errors.notBuissness.message, data: null });
      })
      .catch(() => res.status(401).json({ error: errors.invalidToken.message, data: null }));
  });

  // View own activity's confirmed booking (for businesses)
  api.get('/activities/:activityId/bookings/:bookingId', (req, res) => {
    jwt.verify(req)
      .then((token) => {
        if (jwt.isBusiness(token)) {

          let activityId = ObjectId(req.params.activityId);
          let bookingId = ObjectId(req.params.bookingId);
          
          Activity.findById(activityId).exec()
          .then((activity)=>{
            
            let booking = activity.bookings.id(bookingId);
            if(!!booking)
              res.status(200).json({ error: null, data: booking});
            else
              res.status(404).json({ error: errors.bookingNotFound.message, data: null})
          })
          .catch((error) => res.status(401).json({ error: error.message, data: null }))
          
        }
        else
          return res.status(403).json({ error: errors.notBuissness.message, data: null });
      })
      .catch(() => res.status(401).json({ error: errors.invalidToken.message, data: null }));
  });

  // Edit own activity's confirmed booking (for businesses)
  api.put('/activities/:activityId/bookings/:bookingId', (req, res) => {
    jwt.verify(req)
      .then((token) => {
        if (jwt.isBusiness(token)) {

          let activityId = ObjectId(req.params.activityId);
          let bookingId = ObjectId(req.params.bookingId);
          
          let set = Object.keys(req.body).reduce((acc, cur)=>{acc['bookings.$.' + cur] = req.body[cur]; return acc;}, {});
          Activity.update({_id: activityId, "bookings._id": bookingId},{$set: set})
          .then((numAffected)=>{
              res.status(200).json({ error: null, data: numAffected});
          })
          .catch((error) => res.status(401).json({ error: error.message, data: null }))
          
        }
        else
          return res.status(403).json({ error: errors.notBuissness.message, data: null });
      })
      .catch(() => res.status(401).json({ error: errors.invalidToken.message, data: null }));

  });

  // Delete own activity's confirmed booking (for businesses)
  api.delete('/activities/:activityId/bookings/:bookingId', (req, res) => {
    jwt.verify(req)
      .then((token) => {
        if (jwt.isBusiness(token)) {

          let activityId = ObjectId(req.params.activityId);
          let bookingId = ObjectId(req.params.bookingId);
          
          Activity.findById(activityId).exec()
          .then((activity)=>{
            
            activity.bookings.id(bookingId).remove();

            activity.save()
            .then((activity)=> res.status(200).json({ error: null, data: null}))
            .catch((error) => res.status(401).json({ error: error, data: null }))

          })
          .catch((error) => res.status(401).json({ error: error.message, data: null }))
          
        }
        else
          return res.status(403).json({ error: errors.notBuissness.message, data: null });
      })
      .catch(() => res.status(401).json({ error: errors.invalidToken.message, data: null }));
  });
};
