import mongoose from 'mongoose';

const ActivitySchema = mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  media: [mongoose.Schema({
    gallery: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'Image'
    },
  })],
  /**
   * @NOTE prices are stored in per minute in egyption pounds.
   */
  prices: [mongoose.Schema({
    item: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
  })],

  activityType:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ActivityType'
  },

  bookings : mongoose.Schema({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      required: true
    },
    isConfirmed: {
      type: Boolean,
      required: true
    },

  })


});

export default mongoose.model('Activity', ActivitySchema);