import mongoose from 'mongoose';

const businessesSchema = mongoose.Schema({
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

  media: mongoose.Schema({
    logo: {
      type: String,
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
});

export default mongoose.model('businesses', businessesSchema);
