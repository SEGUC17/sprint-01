import mongoose from 'mongoose';
var bcrypt = require('bcrypt-nodejs');

const UserSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },

  username: {
    type: String,
    unique:true,
    required: true,
  },

  name: mongoose.Schema({
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    },
  }),

  mobileNumber: {
    type: Date,
  },
  
  email: {
    type: String,
    required: true,
  },


  media: mongoose.Schema({
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'Image'
    },
  }),

  role:{
    type:String,
    required: true,
    enum: ['CLIENT','ADMIN','BUSINESS']
  }
  
});

// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

export default mongoose.model('User', UserSchema);