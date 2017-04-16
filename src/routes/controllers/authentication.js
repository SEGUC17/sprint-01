import _ from 'lodash';
import jwt from '../../auth/jwt';
import bcrypt from '../../auth/bcrypt';
import errors from '../../constants/errors';

export default ({ api, db }) => {
  /** Signup as client (for visitors) */

  api.post('/signup', (req, res) => {
    // Create resource
    db.insertOneClient(req.body)
      .then(client => res.status(201).json({ error: null, data: client }))
      .catch((error) => res.status(error.status).json({ error: error.message, data: null }))
  });

  /** Create new admin (for admins) */

  api.post('/admins', (req, res) => {
    jwt.verify(req)
      .then(token => jwt.isAdmin(token))
      .then(() => db.insertOneAdmin(req.body))
      .then(admin => res.status(201).json({ error: null, data: admin }))
      .catch((error) => res.status(error.status).json({ error: error.message, data: null }))
  });

  /** Login as client or admin (for visitors) */

  api.post('/login', (req, res) => {
    // Search users by username
    db.validateUserPassword(req.body.username, req.body.password)
      .then((user) => {
        // Passwords match, issue JWT
        const token = jwt.sign({ username: user.username, isAdmin: user.isAdmin });
        return res.status(200).json({ error: null, data: token });
      })
      // Done
      .catch((error) => res.status(error.status).json({ error: error.message, data: null }))
  });
};
