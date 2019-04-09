const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the model
const userSchema = new Schema({
  email: {
    required: true,
    type: String,
    unique: true,
    lowercase: true,
  },
  password: String,
});

// On save hook, encrypt password
// Before saveing a model, run this function
userSchema.pre('save', function(next) {
  const user = this; // get access to the user model

  // generate a salt then run callback
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    // hash our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);
      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    })
  })
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
