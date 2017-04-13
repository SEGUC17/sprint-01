export default ({ api, db }) => {
  // List all activities (for businesses, clients & admins)
  api.get('/activities', (req, res) => {
    res.json({});
  });

  // Search activities (for businesses, clients & admins)
  api.get('/activities/search', (req, res) => {
    res.json({});
  });

  // View activity (for businesses, clients & admins)
  api.get('/activities/:id', (req, res) => {
    res.json({});
  });

  // Create new activity (for businesses)
  api.post('/activities', (req, res) => {
    res.json({});
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
  api.put('/activities/:id/booking-requests/:id/verify', (req, res) => {
    res.json({});
  });

  // Discard own activity's booking request (for businesses)
  api.delete('/activities/:id/booking-requests/:id/verify', (req, res) => {
    res.json({});
  });
};
