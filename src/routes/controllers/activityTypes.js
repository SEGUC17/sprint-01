import jwt from '../../auth/jwt';
import errors from '../../constants/errors';

export default ({ api, db }) => {
/** List all activity types (for clients & admins) */

  api.get('/activity-types', (req, res) => {
    
    jwt.verify(req)
    .then(()=>db.getAllActivityTypes())
    .then((activityTypes) => { return res.status(200).json({ error: null, data: activityTypes})} )
    .catch((error)=>{ console.log(error);return res.status(error.status).json({ error: error.message, data: null })})
  });

  /** View activity type (for clients & admins) */

  api.get('/activity-types/:id', (req, res) => {

    jwt.verify(req)
    .then(()=>db.getActivityTypeById(req.params.id))
    .then((activityType) => { return res.status(200).json({ error: null, data: activityType})} )
    .catch((error)=>{ return res.status(error.status).json({ error: error.message, data: null })}) 
  
});

  /** Create new activity type (for admins) */

  api.post('/activity-types', (req, res) => {
    jwt.verify(req)
      .then((token)=> jwt.isAdmin(token))
      .then(()=> db.insertOneActivityType(req.body))
      .then((booking) => { return res.status(200).json({ error: null, data: booking})} )
      .catch((error)=>{ return res.status(error.status).json({ error: error.message, data: null }) })
  });

  /** Edit activity type (for admins) */

  api.put('/activity-types/:id', (req, res) => {
    res.json({});
  });

  /** Delete activity type (for admins) */

  api.delete('/activity-types/:id', (req, res) => {
    res.json({});
  });

  /** List all activity type addition requests (for admins) */

  api.get('/activity-types/addition-requests', (req, res) => {
    res.json({});
  });

  /** View activity type addition request (for admins) */

  api.get('/activity-types/addition-requests/:id', (req, res) => {
    res.json({});
  });

  /** Request a new activity type addition (for business owners) */
  api.post('/activity-types/addition-requests', (req, res) => {
    res.json({});
  });

  /** Confirm activity type addition request (for admins) */

  api.put('/activity-types/addition-requests/:id/verify', (req, res) => {
    res.json({});
  });

  /** Discard activity type addition request (for admins) */

  api.delete('/activity-types/addition-requests/:id/verify', (req, res) => {
    res.json({});
  });
};
