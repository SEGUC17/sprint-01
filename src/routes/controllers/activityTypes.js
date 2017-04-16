import _ from 'lodash';

import jwt from '../../auth/jwt';

export default ({ api, db }) => {
  /** List all activity type addition requests (for admins) */

  api.get('/activity-types/addition-requests', (req, res) => {
    jwt.verify(req)
    .then(() => db.getAllActivityTypesRequests())
    .then(activityTypes => res.status(200).json({ error: null, data: activityTypes }))
    .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });


  /** Request a new activity type addition (for business owners) */
  api.post('/activity-types/addition-requests', (req, res) => {
    jwt.verify(req)
    .then(() => db.insertOneActivityType(_.extend(req.body, { isConfirmed: false })))
    .then(activityType => res.status(200).json({ error: null, data: activityType }))
    .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Confirm activity type addition request (for admins) */

  api.put('/activity-types/addition-requests/:id/verify', (req, res) => {
    jwt.verify(req)
      .then(token => jwt.isAdmin(token))
      .then(() => db.updateActivityTypeById(req.params.id, { isConfirmed: true }))
      .then(activityType => res.status(200).json({ error: null, data: activityType }))
      .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Discard activity type addition request (for admins) */

  api.delete('/activity-types/addition-requests/:id/verify', (req, res) => {
    jwt.verify(req)
      .then(token => jwt.isAdmin(token))
      .then(() => db.updateActivityTypeById(req.body))
      .then(() => res.status(200).json({ error: null, data: null }))
      .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** List all activity types (for clients & admins) */

  api.get('/activity-types', (req, res) => {
    jwt.verify(req)
    .then(() => db.getAllActivityTypes())
    .then(activityTypes => res.status(200).json({ error: null, data: activityTypes }))
    .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** View activity type (for clients & admins) */

  api.get('/activity-types/:id', (req, res) => {
    jwt.verify(req)
    .then(() => db.getActivityTypeById(req.params.id))
    .then(activityType => res.status(200).json({ error: null, data: activityType }))
    .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Create new activity type (for admins) */

  api.post('/activity-types', (req, res) => {
    jwt.verify(req)
      .then(token => jwt.isAdmin(token))
      .then(() => db.insertOneActivityType(_.extend(req.body, { isConfirmed: true })))
      .then(activityType => res.status(200).json({ error: null, data: activityType }))
      .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Edit activity type (for admins) */

  api.put('/activity-types/:id', (req, res) => {
    jwt.verify(req)
      .then(token => jwt.isAdmin(token))
      .then(() => db.updateActivityTypeById(req.params.id, req.body))
      .then(activityType => res.status(200).json({ error: null, data: activityType }))
      .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Delete activity type (for admins) */

  api.delete('/activity-types/:id', (req, res) => {
    jwt.verify(req)
      .then(token => jwt.isAdmin(token))
      .then(() => db.deleteActivityTypeById(req.params.id))
      .then(() => res.status(200).json({ error: null, data: null }))
      .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });


  /** Request a new activity type addition (for business owners) */
  api.post('/activity-types/addition-requests', (req, res) => {
    jwt.verify(req)
    .then(() => db.insertOneActivityType(_.extend(req.body, { isConfirmed: false })))
    .then(activityType => res.status(200).json({ error: null, data: activityType }))
    .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Confirm activity type addition request (for admins) */

  api.put('/activity-types/addition-requests/:id/verify', (req, res) => {
    jwt.verify(req)
      .then(token => jwt.isAdmin(token))
      .then(() => db.updateActivityTypeById(req.body))
      .then(activityType => res.status(200).json({ error: null, data: activityType }))
      .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Discard activity type addition request (for admins) */

  api.delete('/activity-types/addition-requests/:id/verify', (req, res) => {
    jwt.verify(req)
      .then(token => jwt.isAdmin(token))
      .then(() => db.updateActivityTypeById(req.body))
      .then(() => res.status(200).json({ error: null, data: null}))
      .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });
};
