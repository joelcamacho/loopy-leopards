// dependencies
const express = require('express');
const morgan  = require('morgan');
const bodyParser = require('body-parser')

// initialize express server
const app = express();
const eventRouter = require('./routes/eventsRouter.js');
const userRouter = require('./routes/usersRouter.js');
const config = require('./config/config.example.js');

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('short'));


// serve client app
app.use(express.static(__dirname + '/../client'));

//  Connect routes
app.use('/api', eventRouter, userRouter);


app.listen(process.env.PORT || 3000, () => {
  console.log('App listening on port', (process.env.PORT || 3000));
});

module.exports = app;