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

  location: mongoose.Schema({
    longitude: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
  }),

  openingHours: mongoose.Schema({
    from: {
      type: Number,
      required: true,
      min: 0,
      max: 23
    },
    to: {
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

var Business = mongoose.model('Business', BusinessSchema);

module.exports = Business;
//export default mongoose.model('Business', BusinessSchema);
