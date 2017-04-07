import jwt from '../../auth/jwt';
import errors from '../../validation/errors';

import Activity from '../../persistence/models/activity';

export default ({ api, db }) => {
  // List own activity's confirmed bookings (for businesses)
  api.get('/activities/:id/bookings', (req, res) => {
    jwt.verify(req)
    .then((token) => {
      let activityId = req.param.id;

      return Activity.findByID(activityId).exec();

      // if (jwt.isAdmin(token)) {
      //   const collection = db.getAllBusinessRegistrations();
      //   return res.status(200).json({ error: null, data: { collection } });
      // }
      // return res.status(403).json({ error: errors.notAdmin.message, data: null });
    })
    .then((activity)=>{
      return activity.bookings
    })
    .catch(() => res.status(401).json({ error: errors.invalidToken.message, data: null }));

    res.json({});
  });

  // View own activity's confirmed booking (for businesses)
  api.get('/activities/:id/bookings/:id', (req, res) => {
    res.json({});
  });

  // Edit own activity's confirmed booking (for businesses)
  api.put('/activities/:id/bookings/:id', (req, res) => {
    res.json({});
  });

  // Delete own activity's confirmed booking (for businesses)
  api.delete('/activities/:id/bookings/:id', (req, res) => {
    res.json({});
  });
};
