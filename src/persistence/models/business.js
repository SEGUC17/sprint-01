import mongoose from 'mongoose';

const BusinessSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
  },

  owner:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  activites :[{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Activity'
  }],

  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
  },

  media: mongoose.Schema({
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'Image'
    },
  }),

  mapLocation: mongoose.Schema({
    longitude: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
  }),
  
  hours: mongoose.Schema({
    opening: {
      type: number,
      required: true,
      min: 0,
      max: 23
    },
    closing: {
      type: String,
      required: true,
      min: 0,
      max: 23
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

export default mongoose.model('Business', businessesSchema);
