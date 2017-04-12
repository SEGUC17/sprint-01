import mongoose from 'mongoose';

const ActivityTypeSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
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
    default: false,
  },
});

export default mongoose.model('ActivityType', ActivityTypeSchema);
