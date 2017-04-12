import jwt from 'jsonwebtoken';
import config from '../config/main';
import roles from '../constants/roles';

export default {
  sign: ({ username, role }) =>
    jwt.sign({ username, role }, config.auth.secret),

  verify: req => new Promise((resolve, reject) => {
    const token = req.headers[config.auth.header];

    jwt.verify(token, config.auth.secret, (err, decoded) => {
      if (err) reject();
      resolve(decoded);
    });
  }),

  isAdmin: token => token.role === roles.ADMIN,

  isOwner: token => token.role === roles.OWNER,

  isClient: token => token.role === roles.CLIENT,
};
