const routes = require('express').Router();
const helpers = require('../helpers/db.helpers.js');
const util = require('../helpers/util.helpers.js');
const twilio = require('twilio');

// handle verify webhook from twilio
routes.post('/api/twilio/verify', function(req, res) {
  const codeArr = req.body.Body.split('_');
  const code = codeArr[0];
  const userId = codeArr[1];

  if(!parseInt(code) || code.length !== 5 || !parseInt(userId)) {
    return res.end('invalid code');
  }

  helpers.getCurrentUserFromId(userId)
  .catch(err => res.end('invalid user id or phone'))
  .then(user => {
    const isValid = util.authenticatePhoneWithCode(req.body.From, code);
    console.log('got user', user, isValid, user.get('phone_validated'));
    let twiml = new twilio.twiml.MessagingResponse();
    if(user.get('phone_validated') === 1) {
      twiml.message('Your phone number has already been validated!');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    } else if(isValid) {
      util.setVerifyPhoneNumber(userId, req.body.From);
      twiml.message('Congratulations! Your phone number has been verified with HanginHubs!');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    } else {
      twiml.message('Invalid code! Please type the correct code, or send another code from your HanginHubs profile settings.');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    }
  })
});

// send code to current user's phone number
// do this only if the user has created an account
routes.post('/api/twilio/phone', function(req, res) {
  if(!req.user) return res.send({result: 'User is not authenticated!'});
  const phone = req.body.phone;

  util.isPhoneValidated(phone)
  .then(result => res.send({result: result}))
  .catch(err => helpers.getCurrentUserFromGoogleId(req.user.id))
  .then(user => util.sendCodeToPhone(phone, user))
  .catch(err => res.send({result: err}));
});

// broadcast a message to all users given an event
// user must be a member of this event
routes.post('/api/twilio/broadcast', function(req, res) {
  const eventId = req.body.id;

  // find user
  new User({google_id: req.user.id}).fetch()
  .then((user) => {
    // check if phone exists and phone is validated
    if(!user.get('phone') || !user.get('phone_validated')) {
      res.send({result: 'phone must be validated for user to broadcast'});
    } else {
      // check if user is part of this event

      // get all members of this event
      // send broadcast with list
    }
  })

});

// send invitation message to all users for this event
// user must be creator of this event
routes.post('/api/twilio/invitations', function(req, res) {
  // given event id
  // check if current user is
    // member of event
    // phone is valid
    // user is member of the group
  // if so, then get all members of the event
  // send invitation with list
});


routes.get('/api/twilio/test', function(req, res) {
  util.sendMessageToPhone('+19734879888', 'Hello Willian!');
});

module.exports = routes;











