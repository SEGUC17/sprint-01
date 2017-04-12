import jwt from '../../auth/jwt';
import errors from '../../validation/errors';

import Activity from '../../persistence/models/activity';
import User from '../../persistence/models/user';
import ActivityType from '../../persistence/models/activityType';
import Business from '../../persistence/models/business';

import mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;

export default ({ api, db }) => {
  // List all activities (for businesses, clients & admins)
  api.get('/activities', (req, res) => {
      Activity.find().exec()
      .then((activities)=>{
        return res.status(200).json({ error: null, data: activities});
      })
      .catch((error) =>{
        res.status(500).json({ error: errors.internalServerError, data: null });
      })
  });

  // Search activities (for businesses, clients & admins)
  api.get('/activities/search', (req, res) => {
      let searchWord = req.query.name; 
      // Activity.find({name: { $regex: new RegExp(searchWord, 'i') } }).exec()
      Activity.find({ $regex: /searchWord/, $options: 'i' }).exec()
      .then((activities)=>{
        return res.status(200).json({ error: null, data: activities});
      })
      .catch((error) =>{
        res.status(500).json({ error: errors.internalServerError, data: null });
      })
  });

  // View activity (for businesses, clients & admins)
  api.get('/activities/:id', (req, res) => {
    
    let activityId = ObjectId(req.params.id);
    Activity.findById(activityId).exec()
    .then((activity)=>{
      return res.status(200).json({ error: null, data: activity}) 
    })
    .catch((error) =>{

      // res.status(500).json({ error: errors.internalServerError.message, data: null });

      res.status(401).json({ error: errors.activityNotFound.message, data: null });

    });

  });

  // Create new activity (for businesses)
  api.post('/activities', (req, res) => {
    jwt.verify(req)
      .then((token) => {
        if (jwt.isBusiness(token)) {
          //TODO handle adding images 
          //Todo check activityType exists or not confiirmed (Done)
          //add activity to businesses if it succeeds .. back track if it wasn't(Done)

          ActivityType.findOne({_id:req.body.ActivityType, isConfirmed:true}).exec()
          .then(()=>{

            new Activity(req.body).save()
            .then((activity)=>{
              
              User.findOne({username: token.username}).exec()
                .then((user) =>{
                  
                  Business.update({'owner': user._id}, {$push: {'activites': activity._id}})
                    .then(()=>res.status(201).json({ error: null, data: activity}) )
                    .catch((err) =>{
                      Activity.remove({_id:activity.ObjectId})
                        .then(()=>res.status(401).json({ error: error, data: null }))
                    })

                })
                .catch((err)=> res.status(403).json({ error: errors.userNotFound.message, data: null }))


            })
            .catch((error) => res.status(401).json({ error: error, data: null }))

          })
          .catch((error)=> res.status(401).json({ error: errors.activityTypeNotFound.message, data: null }))
            
        }
        else
          return res.status(403).json({ error: errors.notBusiness.message, data: null });


        //   new Activity(req.body).save()
        //   .then((activity)=>{
        //     return res.status(201).json({ error: null, data: activity}) 
        //   })
        //   .catch((error) =>{
        //     res.status(401).json({ error: error, data: null });
        //   })
          
        // }
        // else
        //   return res.status(403).json({ error: errors.notAdmin.message, data: null });

      })
      .catch(() => res.status(401).json({ error: errors.invalidToken.message, data: null }));
  });

  // Edit own activity (for businesses)
  api.put('/activities/:id', (req, res) => {
    res.json({});
  });

  // Delete own activity (for businesses)
  api.delete('/activities/:id', (req, res) => {
    res.json({});
  });

  // List own activity's booking requests (for businesses)
  api.get('/activities/:id/booking-requests', (req, res) => {
    res.json({});
  });

  // View own activity's booking request (for businesses)
  api.get('/activities/:id/booking-requests/:id', (req, res) => {
    res.json({});
  });

  // Request an activity's booking (for clients)
  api.post('/activities/:id/booking-requests', (req, res) => {
    res.json({});
  });

  // Confirm own activity's booking request (for businesses)
  api.put('/activities/:id/booking-requests/:id/confirm', (req, res) => {
    res.json({});
  });

  // Discard own activity's booking request (for businesses)
  api.delete('/activities/:id/booking-requests/:id/confirm', (req, res) => {
    res.json({});
  });
};
