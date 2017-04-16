import _ from 'lodash';
import jwt from '../../auth/jwt';
import errors from '../../constants/errors';

export default ({ api, db }) => {
  /** List all businesses (for clients & admins) */

  api.get('/businesses', (req, res, next) => {
    // Verify JWT validity
    jwt.verify(req)
      // Invalid JWT
      .catch(() => res.status(401).json({ error: errors.INVALID_TOKEN.message, data: null }))
      // Get resource
      .then(db.getAllBusinesses)
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

  /** Search businesses (for clients & admins) */

  api.get('/businesses/search', (req, res, next) => {
    // Verify JWT validity
    jwt.verify(req)
      // Invalid JWT
      .catch(() => res.status(401).json({ error: errors.INVALID_TOKEN.message, data: null }))
      // Get resource
      .then(() => db.searchBusinesses(req.query))
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

  /** View business profile (for clients & admins) */

  api.get('/businesses/:id', (req, res, next) => {
    // Verify JWT validity
    jwt.verify(req)
      // Invalid JWT
      .catch(() => res.status(401).json({ error: errors.INVALID_TOKEN.message, data: null }))
      // Get resource
      .then(() => db.getBusinessById(req.params.id))
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

  /** Edit business profile (for business owners) */

  api.put('/businesses/:id', (req, res, next) => {
    // Verify JWT validity
    jwt.verify(req)
      // Invalid JWT
      .catch(() => res.status(401).json({ error: errors.INVALID_TOKEN.message, data: null }))
      // Check if business owner owns this business
      .then(token => db.isRightfulBusinessOwner(token.id, req.params.id))
      // Business owner doesn't own this business
      .catch(() => res.status(403).json({ error: errors.UNRIGHTFUL_BUSINESS_OWNER.message, data: null }))
      // Update resource
      .then(() => db.updateBusinessById(req.params.id, req.body))
      // Couldn't update resource
      .catch(() => res.status(500).json({ error: errors.INTERNAL_SERVER_ERROR.message, data: null }))
      // Respond with updated resource
      .then((document) => {
        if (_.isNull(document)) {
          // No match & nothing updated
          return res.status(404).json({ error: errors.ENTITY_NOT_FOUND.message, data: { document } });
        }
        // Resource found & update
        return res.status(200).json({ error: null, data: { document } });
      })
      // Done
      .catch(() => next());
  });

  /** Delete business profile (for business owners) */

  api.delete('/businesses/:id', (req, res, next) => {
    // Verify JWT validity
    jwt.verify(req)
      // Invalid JWT
      .catch(() => res.status(401).json({ error: errors.INVALID_TOKEN.message, data: null }))
      // Check if business owner owns this business
      .then(token => db.isRightfulBusinessOwner(token.id, req.params.id))
      // Business owner doesn't own this business
      .catch(() => res.status(403).json({ error: errors.UNRIGHTFUL_BUSINESS_OWNER.message, data: null }))
      // Delete resource
      .then(() => db.deleteBusinessById(req.params.id))
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
