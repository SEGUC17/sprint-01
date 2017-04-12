import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const userSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },

  username: {
    type: String,
    unique: true,
    required: true,
  },

  name: mongoose.Schema({
    first: {
      type: String,
      required: true,
    },

    last: {
      type: String,
      required: true,
    },
  }),

  mobile: {
    type: Date,
  },

  email: {
    type: String,
    required: true,
  },

  media: {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
    },
  },

  role: {
    type: String,
    required: true,
    enum: ['CLIENT', 'ADMIN', 'BUSINESS'],
  },
});

// Generate a hash
userSchema.methods.generateHash = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);


// Compare passwords
userSchema.methods.validPassword = password =>
  bcrypt.compareSync(password, this.local.password);

export default mongoose.model('User', userSchema);
