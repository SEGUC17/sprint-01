import mongoose from 'mongoose';

const activitySchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },

  description: {
    type: String,
  },

  media: [
    {
      gallery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
      },
    },
  ],

  /**
   * @NOTE prices are stored per minute in egyption pounds.
   */
  prices: [
    {
      item: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],

  activityType: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ActivityType',
  },

  bookings: [
    mongoose.Schema({
      createdAt: {
        type: Date,
        required: true,
        default: Date.now,
      },

      client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      isConfirmed: {
        type: Boolean,
        required: true,
        default: false,
      },
    }),
  ],
});

activitySchema.pre('save', (next) => {
  this.activityType = new mongoose.Schema.Types.ObjectId(this.activityType);
  next();
});

export default mongoose.model('Activity', activitySchema);
