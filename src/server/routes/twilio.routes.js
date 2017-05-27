const routes = require('express').Router();
const apiKeys = require('../config/config.js');
const twilio = require('twilio');
const TwilioAuthService = require('node-twilio-verify')
const User = require('../db/models/user.js');
const Event = require('../db/models/event.js');

// setup phone auth helper module
twilioAuthService = new TwilioAuthService();
twilioAuthService.init(apiKeys.twilioAccountSid, apiKeys.twilioAuthToken);
twilioAuthService.setFromNumber(apiKeys.twilioFromNumber);

//require the Twilio module and create a REST client 
var client = twilio(apiKeys.twilioAccountSid, apiKeys.twilioAuthToken); 

// Helper Methods
const sendMessageToPhone = (phone, message, callback = (res) => res) => {
  client.messages.create({ 
    to: phone, 
    from: apiKeys.twilioFromNumber, 
    body: message, 
  }, function(err, res) { 
    if(err) {
      console.log(err);
    } else {
      console.log(res.sid);
      callback(res);
    }
  });
}

const sendCodeToPhone = (phone, profile, message = "To verify your HanginHubs please reply with the following 5 numbers and \'_" + profile.id + "\': \n(e.g. 12345_12)\n") => {
  return twilioAuthService.sendCode(phone, message);
}

const authenticatePhoneWithCode = (phone, code) => {
  return twilioAuthService.verifyCode(phone, code);
}

const sendEventInvitation = (user, message) => {
  sendMessageToPhone(user.phone, message);
}

const sendEventInvitations = (event, users) => {
  const message = `You have been invited an event on HanginHubs! Please go to the website to respond. Event Details: ${event.name} on ${event.date_time} at ${event.address}, ${event.city}, ${event.state}`;
  users.forEach(user => sendEventInvitation(user, message));
}

const sendEventAnnouncement = (event, users, announcement) => {
  const message = `Announcement for upcoming event \'${event.name}\': ${announcement}`;
  users.forEach(user => sendEventInvitation(user, message));
}

// Example usage
// var tempEvent = {name: 'Hack Reactor Social Night', date_time: 'Saturday, May 27, 5:00pm', address: '369 Lexington Ave', city: 'NYC', state: 'NY'};
// var tempUsers = [{phone: '+19734879888'}, {phone: '+17182132839'}, {phone: '+16466411017'}];
// sendEventInvitations(tempEvent, tempUsers);
// sendEventAnnouncement(tempEvent, tempUsers, 'Just Joking, the event has been cancelled');

// routes

// handle verify webhook from twilio
routes.post('/api/twilio/verify', function(req, res) {
  console.log(req.body);
  const codeArr = req.body.Body.split('_');
  const code = codeArr[0];
  const userId = codeArr[1];

  if(!parseInt(code) || code.length !== 5 || !parseInt(userId)) {
    console.log('invalid verification code');
    res.end('invalid code');
    return;
  }

  new User({id: userId}).fetch()
    .then((user) => {
      if(!!user) {
        const isValid = authenticatePhoneWithCode(req.body.From, code);
        console.log('user', user, user.get('phone_validated'));

        if(user.get('phone_validated')) {
          let msg = 'Your phone number has already been validated! ';
          const twiml = new twilio.twiml.MessagingResponse();
          twiml.message(msg);
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
        } else if(isValid) {
          let msg = 'Congratulations! Your phone number has been verified with HanginHubs!';
          user.set({'phone_validated': true});
          user.set({'phone': req.body.From});
          user.save();
          const twiml = new twilio.twiml.MessagingResponse();
          twiml.message(msg);
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
        } else {
          const twiml = new twilio.twiml.MessagingResponse();
          twiml.message('Invalid code! Please type the correct code, or send another code from your HanginHubs profile settings.');
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
        }
      } else {
        console.log('invalid user id or phone');
        res.end('invalid user id or phone');
      }
    });
});

// send code to current user's phone number
// do this only if the user has created an account
routes.post('/api/twilio/phone', function(req, res) {
  const phone = req.body.phone;

  // see if user is authenticated
  if(!req.user) return res.send({result: 'User is not authenticated!'});


  // see if phone already exists and is validated
  new User({phone: phone, phone_validated: true}).fetch()
    .then((user) => {
      if(!!user){
        console.log('Phone already validated!');
        res.send({result: 'Phone already validated!'});
      } else {
        // find user
        new User({google_id: req.user.id}).fetch()
        .then((user) => {
          sendCodeToPhone(phone, user);
        })
      }
    })
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

module.exports = routes;











