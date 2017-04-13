import _ from 'lodash';
import jwt from '../../auth/jwt';
import errors from '../../constants/errors';

export default ({ api, db }) => {
  // List all businesses (for businesses, clients & admins)
  api.get('/businesses', (req, res, next) => {
    jwt.verify(req)
      .catch(() => res.status(401).json({ error: errors.invalidToken.message, data: null }))
      .then(db.getAllBusinesses)
      .catch(() => res.status(500).json({ error: errors.internalServerError.message, data: null }))
      .then(collection => res.status(200).json({ error: null, data: { collection } }))
      .catch(() => next());
  });

  // Search businesses (for businesses, clients & admins)
  api.get('/businesses/search', (req, res, next) => {
    jwt.verify(req)
      .catch(() => res.status(401).json({ error: errors.invalidToken.message, data: null }))
      .then(() => db.searchBusinesses(req.query))
      .catch(() => res.status(500).json({ error: errors.internalServerError.message, data: null }))
      .then((collection) => {
        if (_.isEmpty(collection)) return res.status(404).json({ error: null, data: { collection } });
        return res.status(200).json({ error: null, data: { collection } });
      })
      .catch(() => next());
  });

  // View business profile (for businesses, clients & admins)
  api.get('/businesses/:id', (req, res, next) => {
    jwt.verify(req)
      .catch(() => res.status(401).json({ error: errors.invalidToken.message, data: null }))
      .then(() => db.getBusinessById(req.params.id))
      .catch(() => res.status(500).json({ error: errors.internalServerError.message, data: null }))
      .then((document) => {
        if (_.isNull(document)) return res.status(404).json({ error: null, data: { document } });
        return res.status(200).json({ error: null, data: { document } });
      })
      .catch(() => next());
  });

  // Edit business profile (for businesses)
  api.put('/businesses/:id', (req, res, next) => {
    jwt.verify(req)
      .catch(() => res.status(401).json({ error: errors.invalidToken.message, data: null }))
      .then(token => jwt.isOwner(token))
      .catch(() => res.status(403).json({ error: errors.notBusiness.message, data: null }))
      .then(() => db.updateBusinessById(req.params.id, req.body))
      .catch(() => res.status(500).json({ error: errors.internalServerError.message, data: null }))
      .then((document) => {
        if (_.isNull(document)) return res.status(404).json({ error: null, data: { document } });
        return res.status(200).json({ error: null, data: { document } });
      })
      .catch(() => next());
  });

  // Delete business profile (for businesses)
  api.delete('/businesses/:id', (req, res, next) => {
    jwt.verify(req)
      .catch(() => res.status(401).json({ error: errors.invalidToken.message, data: null }))
      .then(token => jwt.isOwner(token))
      .catch(() => res.status(403).json({ error: errors.notBusiness.message, data: null }))
      .then(() => db.deleteBusinessById(req.params.id))
      .catch(() => res.status(500).json({ error: errors.internalServerError.message, data: null }))
      .then((document) => {
        if (_.isNull(document)) return res.status(404).json({ error: null, data: { document } });
        return res.status(200).json({ error: null, data: { document } });
      })
      .catch(() => next());
  });

  // List all business signups (for admins)
  api.get('/business-registrations', (req, res, next) => {
    jwt.verify(req)
      .catch(() => res.status(401).json({ error: errors.invalidToken.message, data: null }))
      .then(token => jwt.isAdmin(token))
      .catch(() => res.status(403).json({ error: errors.notAdmin.message, data: null }))
      .then(db.getAllBusinessRegistrations)
      .catch(() => res.status(500).json({ error: errors.internalServerError.message, data: null }))
      .then(collection => res.status(200).json({ error: null, data: { collection } }))
      .catch(() => next());
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
