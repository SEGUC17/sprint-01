import _ from 'lodash';
import jwt from '../../auth/jwt';
import errors from '../../constants/errors';
import roles from '../../constants/roles';

export default ({ api, db }) => {
  // Signup (for businesses & clients)
  api.post('/signup', (req, res) => {
    res.json({});
  });

  // Login (for businesses, clients & admins)
  api.post('/login', async (req, res) => {
    const { body: { username, password } } = req;

    const adminResults = await db.searchAdmins({ username, password });
    if (!_.isEmpty(adminResults)) {
      const token = jwt.sign({ username, role: roles.ADMIN });
      return res.status(200).json({ error: null, data: { token } });
    }

    const businessResults = await db.searchBusinesses({ username, password });
    if (!_.isEmpty(businessResults)) {
      const token = jwt.sign({ username, role: roles.OWNER });
      return res.status(200).json({ error: null, data: { token } });
    }

    const clientResults = await db.searchClients({ username, password });
    if (!_.isEmpty(clientResults)) {
      const token = jwt.sign({ username, role: roles.CLIENT });
      return res.status(200).json({ error: null, data: { token } });
    }

    return res.status(404).json({ error: errors.userNotFound.message, data: null });
  });
};
