const routes = require('express').Router();
const apiKeys = require('../config/config.js');
const twilio = require('twilio');
const TwilioAuthService = require('node-twilio-verify')

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

const sendCodeToPhone = (phone, message = "Please reply with the following code to verify your HanginHub phone number: ") => {
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
// sendCodeToPhone('+19734879888');

// routes

// handle verify webhook from twilio
routes.post('/api/twilio/verify', function(req, res) {
  console.log(req.body);

  if(!parseInt(req.body.Body) || req.body.Body.length !== 5 ) {
    console.log('invalid verification code');
    res.end('invalid code');
    return;
  }

  const isValid = authenticatePhoneWithCode(req.body.From, req.body.Body);
  
  if(isValid) {
    // Still need to set the validPhone property for this user
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Congratulations! Your phone number has been verified with HanginHubs!');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  } else {
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Invalid code! Please type the correct code, or send another code from your HanginHubs profile settings.');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  }
});

// send code to current user's phone number
routes.post('/api/twilio/phone', function(req, res) {

});

// broadcast a message to all users given an event
// user must be a member of this event
routes.post('/api/twilio/broadcast', function(req, res) {

});

// send invitation message to all users for this event
// user must be creator of this event
routes.post('/api/twilio/invitations', function(req, res) {

});

module.exports = routes;











