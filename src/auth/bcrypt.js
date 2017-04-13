import bcrypt from 'bcrypt-nodejs';

export default {
  /** Generate a hash */
  hash: password =>
    bcrypt.hashSync(password),

  /** Compare passwords */
  compare: (password, hash) =>
    bcrypt.compareSync(password, hash),
};
