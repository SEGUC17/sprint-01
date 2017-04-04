import jwt from '../auth/jwt';
import errors from '../validation/errors';

export default ({ api, db }) => {
  // List all businesses (for businesses, clients & admins)
  api.get('/businesses', (req, res) => {
    res.json({});
  });

  // Search businesses (for businesses, clients & admins)
  api.get('/businesses/search', (req, res) => {
    res.json({});
  });

  // View business profile (for businesses, clients & admins)
  api.get('/businesses/:id', (req, res) => {
    res.json({});
  });

  // Edit business profile (for businesses)
  api.put('/businesses/:id', (req, res) => {
    res.json({});
  });

  // Delete business profile (for businesses)
  api.delete('/businesses/:id', (req, res) => {
    res.json({});
  });

  // List all business signups (for admins)
  api.get('/business-registrations', (req, res) => {
    jwt.verify(req).then(async (token) => {
      if (jwt.isAdmin(token)) {
        const collection = await db.getAllBusinessRegistrations();
        return res.status(200).json({ error: null, data: { collection } });
      }
      return res.status(403).json({ error: errors.notAdmin.message, data: null });
    }).catch(() => res.status(401).json({ error: errors.invalidToken.message, data: null }));
  });

  // View business signup (for admins)
  api.get('/business-registrations/:id', (req, res) => {
    res.json({});
  });

  // Confirm business signup (for admins)
  api.put('/business-registrations/:id/confirm', (req, res) => {
    res.json({});
  });

  // Discard business signup (for admins)
  api.delete('/business-registrations/:id/confirm', (req, res) => {
    res.json({});
  });
};
