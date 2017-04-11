import mongoose from 'mongoose';

const ActivitySchema = mongoose.Schema({

  name: {
    type: String,
    unique: true,
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
   * @NOTE prices are stored per minute in egyption pounds.
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

  bookings : [mongoose.Schema({
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    isConfirmed: {
      type: Boolean,
      required: true,
      default: false
    },

  })]

});

ActivitySchema.pre('save', function(next){
  this.activityType = new mongoose.Schema.Types.ObjectId(this.activityType);
  next();
});

export default mongoose.model('Activity', ActivitySchema);