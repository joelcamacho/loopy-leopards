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

// PUSH TESTING
var fetch = require('node-fetch');

app.post('/api/push/register', function(req, res) {
  console.log(JSON.stringify(req.body));
  res.send({result: 'good'});
});


app.post('/api/push/notification', function(req, res) {

  var key = 'AAAAV7PB6fY:APA91bEiSJmNBgLLZtEzdxPSMxyYl13O24-dA2H9lWYtlqFYyfMhAe_kFkML7OnQVAUTgYb5xL8ii2JOy0CsaAuEm8TeEzAOc6KiUgWJ5u4zDaI8EIKNNoTytRjRtQD3hwMIoHDoMe4e';
  var to = req.body.token;
  var notification = {
    'title': 'Kimmy J Master',
    'body': 'I will take over the world! \n Tomorrow...',
    'icon': 'https://static.seekingalpha.com/uploads/2016/4/957061_14595169907724_rId15.jpg',
    'click_action': 'http://localhost:3000'
  };
  
  fetch('https://fcm.googleapis.com/fcm/send', {
    'method': 'POST',
    'headers': {
      'Authorization': 'key=' + key,
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify({
      'notification': notification,
      'to': to
    })
  }).then(function(response) {
    res.send(response);
  }).catch(function(error) {
    res.send(error);
  })

})

app.listen(process.env.PORT || 3000, () => {
  console.log('App listening on port', (process.env.PORT || 3000));
});

module.exports = app;