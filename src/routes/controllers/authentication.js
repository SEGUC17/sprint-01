import _ from 'lodash';
import jwt from '../../auth/jwt';
import bcrypt from '../../auth/bcrypt';
import errors from '../../constants/errors';

export default ({ api, db }) => {
  /** Signup as client (for visitors) */

  api.post('/signup', (req, res, next) => {
    // Create resource
    db.insertOneClient(req.body)
      // Couldn't create resource
      .catch(() => res.status(500).json({ error: errors.INTERNAL_SERVER_ERROR.message, data: null }))
      // Respond with created resource
      .then(document => res.status(201).json({ error: null, data: { document } }))
      // Done
      .catch(() => next());
  });

  /** Create new admin (for admins) */

  api.post('/admins', (req, res, next) => {
    // Verify JWT validity
    jwt.verify(req)
      // Invalid JWT
      .catch(() => res.status(401).json({ error: errors.INVALID_TOKEN.message, data: null }))
      // Check if admin
      .then(token => jwt.isAdmin(token))
      // Not an admin
      .catch(() => res.status(403).json({ error: errors.NOT_ADMIN.message, data: null }))
      // Create resource
      .then(() => db.insertOneAdmin(req.body))
      // Couldn't create resource
      .catch(() => res.status(500).json({ error: errors.INTERNAL_SERVER_ERROR.message, data: null }))
      // Respond with created resource
      .then(document => res.status(201).json({ error: null, data: { document } }))
      // Done
      .catch(() => next());
  });

  /** Login as client or admin (for visitors) */

  api.post('/login', (req, res) => {
    // Search users by username
    db.getUserByUsername({ username: req.body.username })
      // Couldn't execute search
      .catch(() => res.status(500).json({ error: errors.INTERNAL_SERVER_ERROR.message, data: null }))
      // Search executed
      .then((document) => {
        if (_.isNull(document)) {
          // No username match
          return res.status(404).json({ error: errors.USERNAME_NOT_FOUND.message, data: null });
        }
        // Username match, compare passwords
        if (!bcrypt.compare(req.body.password, document.password)) {
          // Passwords don't match
          return res.status(404).json({ error: errors.PASSWORD_MISMATCH.message, data: null });
        }
        // Passwords match, issue JWT
        const token = jwt.sign({ username: document.username, isAdmin: document.isAdmin });
        return res.status(200).json({ error: null, data: { token } });
      })
      // Done
      .catch(() => next());
  });
};
