import _ from 'lodash';

import jwt from '../../auth/jwt';


export default ({ api, db }) => {
  /** List own activity's confirmed bookings (for business owners) */

  api.get('/activities/:id/bookings', (req, res) => {
    // Verify JWT validity
    jwt.verify(req)
    // get activity by id
    .then(() => db.getActivityById(req.params.id))
    // get activity by id
    .then(activity => res.status(200).json({ error: null, data: activity.bookings.filter(e => e.isConfirmed) }))
    // return errors
    .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** View own activity's confirmed booking (for business owners) */

  api.get('/activities/:activityId/bookings/:bookingId', (req, res) => {
    // Verify JWT validity
    jwt.verify(req)
    .then(() => db.getActivityBookingById(req.params.activityId, req.params.bookingId))
    .then(booking => res.status(200).json({ error: null, data: booking }))
    .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Edit own activity's confirmed booking (for business owners) */

  api.put('/activities/:activityId/bookings/:bookingId', (req, res) => {
    // Verify JWT validity
    jwt.verify(req)
      .then(token => db.isRightfulActivityOwner(token.username, req.params.activityId))
      .then(() => db.updateActivityBookingById(req.params.activityId, req.params.bookingId, req.body))
      .then(activity => res.status(200).json({ error: null, data: activity }))
      .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Delete own activity's confirmed booking (for business owners) */

  api.delete('/activities/:activityId/bookings/:bookingId', (req, res) => {
    jwt.verify(req)
      .then(token => db.isRightfulActivityOwner(token.username, req.params.activityId))
      .then(() => db.deleteActivityBookingById(req.params.activityId, req.params.bookingId, req.body))
      .then(() => res.status(200).json({ error: null, data: null }))
      .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** List own activity's booking requests (for business owners) */

  api.get('/activities/:id/booking-requests', (req, res) => {
    jwt.verify(req)
    .then(() => db.getActivityById(req.params.id))
    .then(activity => res.status(200).json({ error: null, data: activity.bookings.filter(e => !e.isConfirmed) }))
    .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Request an activity's booking (for clients) */

  api.post('/activities/:activityId/booking-requests', (req, res) => {
    jwt.verify(req)
      .then(() => db.insertBooking(req.params.activityId, _.extend(req.body, { isConfirmed: false })))
      .then(booking => res.status(200).json({ error: null, data: booking }))
      .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Confirm own activity's booking request (for business owners) */

  api.put('/activities/:activityId/booking-requests/:bookingId/verify', (req, res) => {
    jwt.verify(req)
      .then(token => db.isRightfulActivityOwner(token.username, req.params.activityId))
      .then(() => db.confirmBooking(req.params.activityId, req.params.bookingId))
      .then(booking => res.status(200).json({ error: null, data: booking }))
      .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });

  /** Discard own activity's booking request (for business owners) */

  api.delete('/activities/:activityId/booking-requests/:bookingId/verify', (req, res) => {
    jwt.verify(req)
      .then(token => db.isRightfulActivityOwner(token.username, req.params.activityId))
      .then(() => db.deleteActivityBookingById(req.params.activityId, req.params.bookingId))
      .then(() => res.status(200).json({ error: null, data: null }))
      .catch(error => res.status(error.status).json({ error: error.message, data: null }));
  });
};
