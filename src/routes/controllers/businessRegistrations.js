import _ from 'lodash';
import jwt from '../../auth/jwt';
import errors from '../../constants/errors';

export default ({ api, db }) => {
  /** List all business signups (for admins) */

  api.get('/business-registrations', (req, res, next) => {
    // Verify JWT validity
    jwt.verify(req)
      // Invalid JWT
      .catch(() => res.status(401).json({ error: errors.INVALID_TOKEN.message, data: null }))
      // Check if admin
      .then(token => jwt.isAdmin(token))
      // Not an admin
      .catch(() => res.status(403).json({ error: errors.NOT_ADMIN.message, data: null }))
      // Get resource
      .then(db.getAllBusinessRegistrations)
      // Couldn't get resource
      .catch(() => res.status(500).json({ error: errors.INTERNAL_SERVER_ERROR.message, data: null }))
      // Respond with resource
      .then((collection) => {
        if (_.isEmpty(collection)) {
          // No match
          return res.status(404).json({ error: errors.ENTITY_NOT_FOUND.message, data: { collection } });
        }
        // Resource found
        return res.status(200).json({ error: null, data: { collection } });
      })
      // Done
      .catch(() => next());
  });

  /** View business signup (for admins) */

  api.get('/business-registrations/:id', (req, res, next) => {
    // Verify JWT validity
    jwt.verify(req)
      // Invalid JWT
      .catch(() => res.status(401).json({ error: errors.INVALID_TOKEN.message, data: null }))
      // Check if admin
      .then(token => jwt.isAdmin(token))
      // Not an admin
      .catch(() => res.status(403).json({ error: errors.NOT_ADMIN.message, data: null }))
      // Get resource
      .then(() => db.getBusinessRegistrationById(req.params.id))
      // Couldn't get resource
      .catch(() => res.status(500).json({ error: errors.INTERNAL_SERVER_ERROR.message, data: null }))
      // Respond with resource
      .then((document) => {
        if (_.isNull(document)) {
          // No match
          return res.status(404).json({ error: errors.ENTITY_NOT_FOUND.message, data: { document } });
        }
        // Resource found
        return res.status(200).json({ error: null, data: { document } });
      })
      // Done
      .catch(() => next());
  });

  /** Signup for business (for clients) */

  api.post('/business-registrations', (req, res, next) => {
    // Verify JWT validity
    jwt.verify(req)
      // Invalid JWT
      .catch(() => res.status(401).json({ error: errors.INVALID_TOKEN.message, data: null }))
      // Check if client
      .then(token => jwt.isClient(token))
      // Not a client
      .catch(() => res.status(403).json({ error: errors.NOT_CLIENT.message, data: null }))
      // Create resource
      .then(() => db.insertOneBusinessRegistration(req.body))
      // Couldn't create resource
      .catch(() => res.status(500).json({ error: errors.INTERNAL_SERVER_ERROR.message, data: null }))
      // Respond with created resource
      .then(document => res.status(201).json({ error: null, data: { document } }))
      // Done
      .catch(() => next());
  });

  /** Confirm business signup (for admins) */

  api.put('/business-registrations/:id/verify', (req, res, next) => {
    // Verify JWT validity
    jwt.verify(req)
      // Invalid JWT
      .catch(() => res.status(401).json({ error: errors.INVALID_TOKEN.message, data: null }))
      // Check if admin
      .then(token => jwt.isAdmin(token))
      // Not an admin
      .catch(() => res.status(403).json({ error: errors.NOT_ADMIN.message, data: null }))
      // Update resource
      .then(() => db.updateBusinessRegistrationById(req.params.id, { isVerified: true }))
      // Couldn't update resource
      .catch(() => res.status(500).json({ error: errors.INTERNAL_SERVER_ERROR.message, data: null }))
      // Respond with updated resource
      .then((document) => {
        if (_.isNull(document)) {
          // No match & nothing updated
          return res.status(404).json({ error: errors.ENTITY_NOT_FOUND.message, data: { document } });
        }
        // Resource found & updated
        return res.status(200).json({ error: null, data: { document } });
      })
      // Done
      .catch(() => next());
  });

  /** Discard business signup (for admins) */

  api.delete('/business-registrations/:id/verify', (req, res, next) => {
    // Verify JWT validity
    jwt.verify(req)
      // Invalid JWT
      .catch(() => res.status(401).json({ error: errors.INVALID_TOKEN.message, data: null }))
      // Check if admin
      .then(token => jwt.isAdmin(token))
      // Not an admin
      .catch(() => res.status(403).json({ error: errors.NOT_ADMIN.message, data: null }))
      // Delete resource
      .then(() => db.deleteBusinessRegistrationById(req.params.id))
      // Couldn't delete resource
      .catch(() => res.status(500).json({ error: errors.INTERNAL_SERVER_ERROR.message, data: null }))
      // Respond with deleted resource
      .then((document) => {
        if (_.isNull(document)) {
          // No match & nothing deleted
          return res.status(404).json({ error: errors.ENTITY_NOT_FOUND.message, data: { document } });
        }
        // Resource found & deleted
        return res.status(200).json({ error: null, data: { document } });
      })
      // Done
      .catch(() => next());
  });
};
