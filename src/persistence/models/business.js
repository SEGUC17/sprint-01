import mongoose from 'mongoose';

const businessSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  name: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
  },

  location: {
    longitude: {
      type: Number,
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },
  },

  openingHours: {
    from: {
      type: Number,
      required: true,
      min: 0,
      max: 23,
    },

    to: {
      type: Number,
      required: true,
      min: 0,
      max: 23,
    },
  },

  media: {
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
    },
  },

  contactInfo: {
    telephones: {
      type: [String],
    },

    website: {
      type: String,
    },

    facebook: {
      type: String,
    },

    twitter: {
      type: String,
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },

  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Activity',
    },
  ],
});

export default mongoose.model('Business', businessSchema);
