const routes = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const apiKeys = require('../config/config.js');
const User = require('../db/models/user.js');

// Google OAuth
passport.use(new GoogleStrategy({
    clientID: apiKeys.googleClientId,
    clientSecret: apiKeys.googleClientSecret,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
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

    var userData = {};

    userData.first_name = req.user.name.givenName;
    userData.last_name = req.user.name.familyName;
    userData.google_id = req.user.id;
    
    console.log(userData);

    new User({google_id: userData.google_id}).fetch()
    .then((user) => {
      if(user === null) {
        User.forge(userData).save()
        .then((user) => {
          console.log(user);
          res.redirect('/');  
        })
        .catch((err) => {
          console.log(err)
          res.redirect('/');
        })
      } else {
        res.redirect('/');
      }
    })
  });

module.exports = routes;