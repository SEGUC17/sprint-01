import { Router } from 'express';
import authenticationController from './controllers/authentication';
import businessesController from './controllers/businesses';
import activitiesController from './controllers/activities';
import activityBookingsController from './controllers/activityBookings';
import activityTypesController from './controllers/activityTypes';

export default ({ db }) => {
  const api = Router();

  /** Signup & Login */
  authenticationController({ api, db });

  /** Businesses & Business Registrations */
  businessesController({ api, db });

  /** Activities */
  activitiesController({ api, db });

  /** Activity Bookings & Activity Booking Requests */
  activityBookingsController({ api, db });

  /** Activity Types & Activity Type Addition Requests */
  activityTypesController({ api, db });

  return api;
};
