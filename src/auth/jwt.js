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

  isAdmin: token => new Promise((resolve, reject) => {
    if (token.role === roles.ADMIN) resolve();
    reject();
  }),

  isBusinessOwner: token => new Promise((resolve, reject) => {
    if (token.role === roles.BUSINESS_OWNER) resolve();
    reject();
  }),

  isClient: token => new Promise((resolve, reject) => {
    if (token.role === roles.CLIENT) resolve();
    reject();
  }),
};
