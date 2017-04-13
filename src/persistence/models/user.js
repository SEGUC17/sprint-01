import mongoose from 'mongoose';
import bcrypt from '../../auth/bcrypt';

const userSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  username: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  name: {
    first: {
      type: String,
      required: true,
    },

    last: {
      type: String,
      required: true,
    },
  },

  mobile: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  media: {
    profilePicture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
    },
  },
});

// eslint-disable-next-line prefer-arrow-callback, func-names
userSchema.pre('save', function (next) {
  this.password = bcrypt.hash(this.password);
  next();
});

export default mongoose.model('User', userSchema);
