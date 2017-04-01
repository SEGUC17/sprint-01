import { Router } from 'express';
import _ from 'lodash';

export default ({ db, jwt, config }) => {
  const api = Router();

  /** Errors */

  const invalidTokenError = new Error('Invalid token');
  const userNotFoundError = new Error('User not found');
  const notAdminError = new Error('Not admin');

  /** Helpers */

  const verifyJWT = req => new Promise((resolve, reject) => {
    const token = req.headers[config.header];
    try {
      resolve(jwt.verify(token, config.secret));
    } catch (err) {
      reject(invalidTokenError);
    }
  });

  const isAdminJWT = (token) => {
    const { role } = token;
    return role === 'ADMIN';
  };

  const isBusinessJWT = (token) => {
    const { role } = token;
    return role === 'BUSINESS';
  };

  const isClientJWT = (token) => {
    const { role } = token;
    return role === 'CLIENT';
  };

  /** Signup & Login */

  // Signup (for businesses & clients)
  api.post('/signup', (req, res) => {
    res.json({});
  });

  // Login (for businesses, clients & admins)
  api.post('/login', async (req, res) => {
    const { body: { username, password } } = req;

    const adminResults = await db.searchAdmins({ username, password });
    if (!_.isEmpty(adminResults)) {
      const token = jwt.sign({ username, role: 'ADMIN' }, config.secret);
      return res.status(200).json({ error: null, data: { token } });
    }

    const businessResults = await db.searchBusinesses({ username, password });
    if (!_.isEmpty(businessResults)) {
      const token = jwt.sign({ username, role: 'BUSINESS' }, config.secret);
      return res.status(200).json({ error: null, data: { token } });
    }

    const clientResults = await db.searchClients({ username, password });
    if (!_.isEmpty(clientResults)) {
      const token = jwt.sign({ username, role: 'CLIENT' }, config.secret);
      return res.status(200).json({ error: null, data: { token } });
    }

    return res.status(404).json({ error: userNotFoundError.message, data: null });
  });

  /** Businesses */

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

  /** Business Registrations */

  // List all business signups (for admins)
  api.get('/business-registrations', (req, res) => {
    verifyJWT(req).then(async (token) => {
      if (isAdminJWT(token)) {
        const collection = await db.getAllBusinessRegistrations();
        return res.status(200).json({ error: null, data: { collection } });
      }
      return res.status(403).json({ error: notAdminError.message, data: null });
    }).catch(() => res.status(401).json({ error: invalidTokenError.message, data: null }));
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

  /** Activities */

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

  /** Activity Bookings */

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

  /** Activity Booking Requests */

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
  api.put('/activities/:id/booking-requests/:id/confirm', (req, res) => {
    res.json({});
  });

  // Discard own activity's booking request (for businesses)
  api.delete('/activities/:id/booking-requests/:id/confirm', (req, res) => {
    res.json({});
  });

  /** Activity Types */

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

  /** Activity Type Addition Requests */

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

  return api;
};
