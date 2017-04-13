export default ({ api, db }) => {
  /** List own activity's confirmed bookings (for business owners) */

  api.get('/activities/:id/bookings', (req, res) => {
    res.json({});
  });

  /** View own activity's confirmed booking (for business owners) */

  api.get('/activities/:activityId/bookings/:bookingId', (req, res) => {
    res.json({});
  });

  /** Edit own activity's confirmed booking (for business owners) */

  api.put('/activities/:activityId/bookings/:bookingId', (req, res) => {
    res.json({});
  });

  /** Delete own activity's confirmed booking (for business owners) */

  api.delete('/activities/:activityId/bookings/:bookingId', (req, res) => {
    res.json({});
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
};
