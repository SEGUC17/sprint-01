import jwt from 'jsonwebtoken';
import config from '../config/main';
import errors from '../validation/errors';

export default {
  sign: ({ username, role }) =>
    jwt.sign({ username, role }, config.secret),

  verify: req => new Promise((resolve, reject) => {
    const token = req.headers[config.auth.header];
    try {
      resolve(jwt.verify(token, config.auth.secret));
    } catch (err) {
      reject(errors.invalidToken);
    }
  }),

  isAdmin: (token) => {
    const { role } = token;
    return role === 'ADMIN';
  },

  isBusiness: (token) => {
    const { role } = token;
    return role === 'BUSINESS';
  },

  isClient: (token) => {
    const { role } = token;
    return role === 'CLIENT';
  },
};
