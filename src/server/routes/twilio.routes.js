const routes = require('express').Router();
const helpers = require('../helpers/db.helpers.js');
const util = require('../helpers/util.helpers.js');
const twilio = require('twilio');

// handle verify webhook from twilio
routes.post('/api/twilio/verify', function(req, res) {
  const codeArr = req.body.Body.split('_');
  const code = codeArr[0];
  const userId = codeArr[1];
  const phone = req.body.From;
  let anonymous_id = null;
  let eventsInvitedTo = [];
  let groupsBelongingTo = [];

  if(!parseInt(code) || code.length !== 5 || !parseInt(userId)) {
    return res.end('invalid code');
  }

  helpers.getCurrentUserFromId(userId)
  .catch(err => res.end('invalid user id or phone'))
  .then(user => {
    const isValid = util.authenticatePhoneWithCode(req.body.From, code);

    console.log('got user', user, isValid, user.get('phone_validated'));

    let twiml = new twilio.twiml.MessagingResponse();

    if(user.get('phone_validated') === 1) { //user.get('phone_validated') === 1
      twiml.message('Your phone number has already been validated!');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    } else if(isValid) { // isValid
      // if valid, then merge anonymous account if exists
      return helpers.getCurrentUserFromPhone(phone);
    } else {
      twiml.message('Invalid code! Please type the correct code, or send another code from your HanginHubs profile settings.');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    }
  })
  .catch(err => {
    let twiml = new twilio.twiml.MessagingResponse();
    util.setVerifyPhoneNumber(userId, phone);
    twiml.message('Congratulations! Your phone number has been verified with HanginHubs!');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  })
  .then(user => {
    let details = user.serialize();

    anonymous_id = details.id;

    if(details.first_name === 'Anonymous') {
      return helpers.getCurrentUserEvents(anonymous_id);
    } else {
      res.send({result: 'User with this phone is already verified!'});
    }
  })
  .then(events => {
    eventsInvitedTo = events ? events.invitedTo : [];

    let inviteUserToEvents = eventsInvitedTo.map(event => {
      return helpers.requestORInviteToJoinEvent(userId, event.id);
    });

    return Promise.all(inviteUserToEvents);
  })
  .then(results => {
    let rejectUserToEvents = eventsInvitedTo.map(event => {
      return helpers.rejectInvitationToJoinEvent(anonymous_id, event.id);
    });

    return Promise.all(rejectUserToEvents);
  })
  .then(results => {
    //return helpers.deleteCurrentUserFromId(anonymous_id);
    return helpers.updateCurrentUserFromId(anonymous_id, {phone: 'null'});
  })
  .then(result => {
    // All events from anonymous user transfered to verfied user
    let twiml = new twilio.twiml.MessagingResponse();
    util.setVerifyPhoneNumber(userId, phone);
    twiml.message('Congratulations! Your phone number has been verified with HanginHubs!');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
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
  .catch(err => res.send({result: err}))
  .then(result => res.send({result: 'Successfully sent code to' + phone}));
});

module.exports = routes;











