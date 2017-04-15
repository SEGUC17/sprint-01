export default {
  INVALID_TOKEN: {message:'Invalid token', status:401},
  UNAUTHORIZED: {message:'Unauthorized', status:403},

  NOT_ADMIN: {message:'Not admin', status:403},
  NOT_CLIENT: {message:'Not client', status:403},
  NOT_BUSINESS: {message:'Not Business owner', status:403},
  
  UNRIGHTFUL_BUSINESS_OWNER: {message:'Unrightful business owner', status:403},
  UNRIGHTFUL_ACTIVITY_OWNER: {message:'Unrightful activity owner', status:403},
  USERNAME_NOT_FOUND: {message:'Username not found', status:404},
  PASSWORD_MISMATCH: {message:'Password mismatch', status:404},

  ENTITY_NOT_FOUND: {message:'Entity not found', status:404},
  BOOKING_NOT_FOUND: {message:'Booking not found', status:404},
  USER_NOT_FOUND: {message:'User not found', status:404},
  ACTIVITY_NOT_FOUND: {message:'Activity not found', status:404},
  ACTIVITY_TYPE_NOT_FOUND: {message:'ActivityType not found', status:404},
  BUSINESS_NOT_FOUND: {message:'BUSINESS not found', status:404},
  
  INTERNAL_SERVER_ERROR: {message:'Internal Server Error', status:500},
  
  BAD_REQUEST: message=>{return {message, status:400}}
};
