export default {
  INVALID_TOKEN: new Error('Invalid token'),
  UNAUTHORIZED: new Error('Unauthorized'),

  NOT_ADMIN: new Error('Not admin'),
  NOT_CLIENT: new Error('Not client'),
  NOT_BUSINESS: new Error('Not Business owner'),
  
  UNRIGHTFUL_BUSINESS_OWNER: new Error('Unrightful business owner'),
  USERNAME_NOT_FOUND: new Error('Username not found'),
  PASSWORD_MISMATCH: new Error('Password mismatch'),

  ENTITY_NOT_FOUND: new Error('Entity not found'),
  BOOKING_NOT_FOUND: new Error('Booking not found'),
  USER_NOT_FOUND: new Error('User not found'),
  ACTIVITY_NOT_FOUND: new Error('Activity not found'),
  BOOKING_NOT_FOUND: new Error('Booking not found'),
  BUSINESS_NOT_FOUND: new Error('BUSINESS not found'),
  
  INTERNAL_SERVER_ERROR: new Error('Internal Server Error'),
};
