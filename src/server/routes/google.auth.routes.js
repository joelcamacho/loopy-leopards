const routes = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const apiKeys = require('../config/config.js');

// Google OAuth
passport.use(new GoogleStrategy({
    clientID: apiKeys.googleClientId,
    clientSecret: apiKeys.googleClientSecret,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  	return done(null, profile);
  }
));

routes.get('/auth/google',
  passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'}));
 
routes.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('Successful authentication google', req.user);
    res.redirect('/');
  });

module.exports = routes;