export default ({ api, db }) => {
  /** List all activities (for clients & admins) */

  api.get('/activities', (req, res) => {
    res.json({});
  });

  /** Search activities (for clients & admins) */

  api.get('/activities/search', (req, res) => {
    res.json({});
  });

  /** View activity (for clients & admins) */

  api.get('/activities/:id', (req, res) => {
    res.json({});
  });

  /** Create new activity (for business owners) */

  api.post('/activities', (req, res) => {
    res.json({});
  });

  /** Edit own activity (for business owners) */

  api.put('/activities/:id', (req, res) => {
    res.json({});
  });

  /** Delete own activity (for business owners) */

  api.delete('/activities/:id', (req, res) => {
    res.json({});
  });
};
