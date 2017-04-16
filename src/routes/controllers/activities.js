import jwt from '../../auth/jwt';


export default ({ api, db }) => {
  /** List all activities (for clients & admins) */

  api.get('/activities', (req, res) => {
    jwt.verify(req)
    .then(() => db.getAllActivities())
    .then(activities => res.status(200).json({ error: null, data: activities }))
    .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Search activities (for clients & admins) */

  api.get('/activities/search', (req, res) => {
    jwt.verify(req)
    .then(() => db.searchActivities(req.query.name))
    .then(activities => res.status(200).json({ error: null, data: activities }))
    .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** View activity (for clients & admins) */

  api.get('/activities/:id', (req, res) => {
    jwt.verify(req)
    .then(() => db.getActivityById(req.params.id))
    .then(activity => res.status(200).json({ error: null, data: activity }))
    .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Create new activity (for business owners) */

  api.post('/activities', (req, res) => {
    jwt.verify(req)
    .then(token => db.isBusinessOwner(token.username))
    .then(business => db.insertOneActivity(req.body, business._id))
    .then(activityType => res.status(200).json({ error: null, data: activityType }))
    .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Edit own activity (for business owners) */

  api.put('/activities/:id', (req, res) => {
    jwt.verify(req)
      .then(token => db.isRightfulActivityOwner(token.username, req.params.id))
      .then(() => db.updateActivityById(req.params.id, req.body))
      .then(activity => res.status(200).json({ error: null, data: activity }))
      .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Delete own activity (for business owners) */

  api.delete('/activities/:id', (req, res) => {
    jwt.verify(req)
      .then(token => db.isRightfulActivityOwner(token.username, req.params.id))
      .then(() => db.deleteActivityById(req.params.id))
      .then(() => res.status(200).json({ error: null, data: null }))
      .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });
};
