export default ({ api, db }) => {
  // List own activity's confirmed bookings (for businesses)
  api.get('/activities/:id/bookings', (req, res) => {
    res.json({});
  });

  // View own activity's confirmed booking (for businesses)
  api.get('/activities/:id/bookings/:id', (req, res) => {
    res.json({});
  });

  // Edit own activity's confirmed booking (for businesses)
  api.put('/activities/:id/bookings/:id', (req, res) => {
    res.json({});
  });

  // Delete own activity's confirmed booking (for businesses)
  api.delete('/activities/:id/bookings/:id', (req, res) => {
    res.json({});
  });
};
