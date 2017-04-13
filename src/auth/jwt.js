import jwt from 'jsonwebtoken';
import config from '../config/main';
import roles from '../constants/roles';

export default {
  sign: ({ id, role }) =>
    jwt.sign({ id, role }, config.auth.secret),

  verify: req => new Promise((resolve, reject) => {
    const token = req.headers[config.auth.header];

    jwt.verify(token, config.auth.secret, (err, decoded) => {
      if (err) reject();
      resolve(decoded);
    });
  }),

  isAdmin: token => new Promise((resolve, reject) => {
    if (token.role === roles.ADMIN) return resolve(token);
    return reject();
  }),

  isBusinessOwner: token => new Promise((resolve, reject) => {
    if (token.role === roles.BUSINESS_OWNER) return resolve(token);
    return reject();
  }),

  isClient: token => new Promise((resolve, reject) => {
    if (token.role === roles.CLIENT) return resolve(token);
    return reject();
  }),
};
