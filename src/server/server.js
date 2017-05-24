// dependencies
const express = require('express');
const morgan  = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config/config.js');
const routes = require('./routes/index.js');

// initialize express server
const app = express();

// Passport
const passport = require('passport');
app.use(require('express-session')({
  secret: 'loopyleopards',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));


// add morgan middleware logger
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(morgan('short'));


// serve client app
app.use(express.static(__dirname + '/../client'));

//  Connect routes
app.use(routes);

app.listen(process.env.PORT || 3000, () => {
  console.log('App listening on port', (process.env.PORT || 3000));
});

module.exports = app;