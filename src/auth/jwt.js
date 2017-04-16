import jwt from 'jsonwebtoken';
import config from '../constants/config';
import errors from '../constants/errors'

export default {
  sign: ({ username, isAdmin }) =>
    jwt.sign({ username, isAdmin }, config.auth.secret),

  verify: req => new Promise((resolve, reject) => {
    const token = req.headers[config.auth.header];

    jwt.verify(token, config.auth.secret, (err, decoded) => {
      if (err) reject(errors.INVALID_TOKEN);
      resolve(decoded);
    });
  }),

  isAdmin: token => new Promise((resolve, reject) => {
    if (token.isAdmin) return resolve(token);
    return reject(errors.NOT_ADMIN);
  }),

  isClient: token => new Promise((resolve, reject) => {
    if (!token.isAdmin) return resolve(token);
    return reject();
  }),
};
