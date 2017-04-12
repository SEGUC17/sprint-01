export default {
  invalidToken: new Error('Invalid token'),
  notAuthorized: new Error('Not authorized'),
  
  notAdmin: new Error('Not admin'),
  notBusiness: new Error('Not Business'),

  userNotFound: new Error('User not found'),
  bookingNotFound: new Error('Booking not found'),
  activityNotFound: new Error('Activity not found'),
  activityTypeNotFound: new Error('Activity type not found'),

  
  internalServerError: new Error('Internal Server Error'),
  
};
