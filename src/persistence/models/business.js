import mongoose from 'mongoose';

const BusinessSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },

  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  description: {
    type: String,
  },

  location: mongoose.Schema({
    longitude: {
      type: Number,
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },
  }),

  openingHours: mongoose.Schema({
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
  }),

  media: mongoose.Schema({
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
    },
  }),

  contactInfo: mongoose.Schema({
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
  }),

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },

  activites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Activity',
    },
  ],
});

export default mongoose.model('Business', BusinessSchema);
