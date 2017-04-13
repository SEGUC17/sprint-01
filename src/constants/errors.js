export default {
  INVALID_TOKEN: new Error('Invalid token'),
  UNAUTHORIZED: new Error('Unauthorized'),
  NOT_ADMIN: new Error('Not admin'),
  NOT_BUSINESS_OWNER: new Error('Not business owner'),
  NOT_RIGHTFUL_BUSINESS_OWNER: new Error('Not rightful business owner'),
  NOT_CLIENT: new Error('Not client'),
  USER_NOT_FOUND: new Error('User not found'),
  ENTITY_NOT_FOUND: new Error('Entity not found'),
  // bookingNotFound: new Error('Booking not found'),
  // activityNotFound: new Error('Activity not found'),
  // activityTypeNotFound: new Error('Activity type not found'),
  INTERNAL_SERVER_ERROR: new Error('Internal Server Error'),
};
