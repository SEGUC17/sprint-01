export default {
  invalidToken: new Error('Invalid token'),
  notAuthorized: new Error('Not authorized'),
  
  notAdmin: new Error('Not admin'),
  notBuissness: new Error('Not admin'),

  userNotFound: new Error('User not found'),
  bookingNotFound: new Error('Booking not found'),
  activityNotFound: new Error('Activity not found'),
};
