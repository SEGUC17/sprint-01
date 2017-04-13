export default {
  INVALID_TOKEN: new Error('Invalid token'),
  UNAUTHORIZED: new Error('Unauthorized'),
  NOT_ADMIN: new Error('Not admin'),
  NOT_CLIENT: new Error('Not client'),
  UNRIGHTFUL_BUSINESS_OWNER: new Error('Unrightful business owner'),
  USERNAME_NOT_FOUND: new Error('Username not found'),
  PASSWORD_MISMATCH: new Error('Password mismatch'),
  ENTITY_NOT_FOUND: new Error('Entity not found'),
  INTERNAL_SERVER_ERROR: new Error('Internal Server Error'),
};
