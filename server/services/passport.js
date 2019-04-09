const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const User = require('../models/user');
const config = require('../config');

// Create local strategy
const localOptions = {
  usernameField: 'email',
};
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // Verify this email and password
  User.findOne({ email }, (err, user) => {
    if (err) return done(err, false);
    // If no user, call done with false
    if (!user) return done(null, false);
    // User exists!! Compare passwords
    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err);
      if (!isMatch) return done(null, false);
      // Call done with the user if it is correct email and password
      // PASSPORT lib packs `user` insire req.user (u can use it in controller)
      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if the user ID in the payload exists in DB
  User.findById(payload.sub, (err, user) => {
    if (err) return done(err, false);
    // If it does, call 'done' with that other
    if (user) done(null, user);
    // otherwise, call done without a user object
    else done(null, false);
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
