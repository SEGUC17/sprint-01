export default ({ api, db }) => {
  // List all activity types (for businesses, clients & admins)
  api.get('/activity-types', (req, res) => {
    res.json({});
  });

  // View activity type (for businesses, clients & admins)
  api.get('/activity-types/:id', (req, res) => {
    res.json({});
  });

  // Create new activity type (for admins)
  api.post('/activity-types', (req, res) => {
    res.json({});
  });

  // Edit activity type (for admins)
  api.put('/activity-types/:id', (req, res) => {
    res.json({});
  });

  // Delete activity type (for admins)
  api.delete('/activity-types/:id', (req, res) => {
    res.json({});
  });

  // List all activity type addition requests (for admins)
  api.get('/activity-types/addition-requests', (req, res) => {
    res.json({});
  });

  // View activity type addition request (for admins)
  api.get('/activity-types/addition-requests/:id', (req, res) => {
    res.json({});
  });

  // Request a new activity type addition (for businesses)
  api.post('/activity-types/addition-requests', (req, res) => {
    res.json({});
  });

  // Confirm activity type addition request (for admins)
  api.put('/activity-types/addition-requests/:id/confirm', (req, res) => {
    res.json({});
  });

  // Discard activity type addition request (for admins)
  api.delete('/activity-types/addition-requests/:id/confirm', (req, res) => {
    res.json({});
  });
};
