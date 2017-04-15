import mongoose from 'mongoose';

const activityTypeSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  isConfirmed: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model('ActivityType', activityTypeSchema);
