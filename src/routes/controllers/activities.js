import jwt from '../../auth/jwt';
import errors from '../../constants/errors';

import _ from 'lodash';

export default ({ api, db }) => {
  /** List all activities (for clients & admins) */

  api.get('/activities', (req, res) => {
    jwt.verify(req)
    .then(()=>db.getAllActivities())
    .then((activities) => { return res.status(200).json({ error: null, data: activities})} )
    .catch((error)=>{ return res.status(error.status).json({ error: error.message, data: null })})
  });

  /** Search activities (for clients & admins) */

  api.get('/activities/search', (req, res) => {
    jwt.verify(req)
    .then(()=> db.searchActivities(req.query.name))
    .then((activities) => { return res.status(200).json({ error: null, data: activities})} )
    .catch((error)=>{ return res.status(error.status).json({ error: error.message, data: null }) })
  });

  /** View activity (for clients & admins) */

  api.get('/activities/:id', (req, res) => {
    jwt.verify(req)
    .then(()=>db.getActivityById(req.params.id))
    .then((activity) => { return res.status(200).json({ error: null, data: activity})} )
    .catch((error)=>{ return res.status(error.status).json({ error: error.message, data: null })}) 
  });

  /** Create new activity (for business owners) */

  api.post('/activities', (req, res) => {
    jwt.verify(req)
    .then((token)=> db.isBusinessOwner(token.username))
    .then((business)=> db.insertOneActivity(req.body, business._id ))      
    .then((activityType) => { return res.status(200).json({ error: null, data: activityType})} )
    .catch((error)=>{ return res.status(error.status).json({ error: error.message, data: null }) })
  });

  /** Edit own activity (for business owners) */

  api.put('/activities/:id', (req, res) => {
    jwt.verify(req)
      .then((token)=> db.isRightfulActivityOwner(token.username, req.params.id))
      .then(()=> db.updateActivityById(req.params.id, req.body))
      .then((activity) => { return res.status(200).json({ error: null, data: activity})} )
      .catch((error)=>{ return res.status(error.status).json({ error: error.message, data: null }) })
  });

  /** Delete own activity (for business owners) */

  api.delete('/activities/:id', (req, res) => {
    jwt.verify(req)
      .then((token)=> db.isRightfulActivityOwner(token.username, req.params.id))
      .then(()=> db.deleteActivityById(req.params.id))
      .then(() => { return res.status(200).json({ error: null, data: null})} )
      .catch((error)=>{ return res.status(error.status).json({ error: error.message, data: null }) })
  });
};
