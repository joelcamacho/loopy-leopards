const fetch = require('node-fetch');
const Promise = require('promise');
const apiKeys = require('../config/config.js');
const User = require('../db/models/user.js');
const Event = require('../db/models/event.js');
const helpers = require('./db.helpers.js');
const twilio = require('twilio');
const TwilioAuthService = require('node-twilio-verify')

// setup phone auth helper module and twilio client
const twilioAuthService = new TwilioAuthService();
twilioAuthService.init(apiKeys.twilioAccountSid, apiKeys.twilioAuthToken);
twilioAuthService.setFromNumber(apiKeys.twilioFromNumber);
const client = twilio(apiKeys.twilioAccountSid, apiKeys.twilioAuthToken); 


// Firebase Cloud Messaging Notification helpers

const _pushToUserFromId = (id, options = {}) => {
  const key = apiKeys.fcmServerKey;
  const notification = {
    'title': options.title || 'Kimmy J Master',
    'body': options.body || 'I will take over the world! Tomorrow...',
    'icon': options.icon || 'https://static.seekingalpha.com/uploads/2016/4/957061_14595169907724_rId15.jpg',
    'click_action': options.click_action || 'http://localhost:3000'
  };
  return new Promise(function (resolve, reject) {
    helpers.getCurrentUserTokenFromId(id)
    .catch(err => resolve(error))
    .then(to => fetch('https://fcm.googleapis.com/fcm/send', {
        'method': 'POST',
        'headers': {
          'Authorization': 'key=' + key,
          'Content-Type': 'application/json'
        },
        'body': JSON.stringify({
          'notification': notification,
          'to': to
        })
      })
    )
    .catch(error => reject(error))
    .then(response => resolve(response))
    })
}

// Send push notification to user given id
exports.pushToUserFromId = (id, options = {}) => {
  return _pushToUserFromId(id, options);
}

// Send notifications a group of users
exports.pushToUsers = (users, options = {}) => {
  users.forEach(user => {
    _pushToUserFromId(user.id, options)
  })
}

// To receive notification, user must allow notifications
// Register and unregister user to receive notifications
exports.updateUserTokenFromId = (id, token) => {
  return new Promise(function (resolve, reject) {
    new User({id: id}).fetch()
    .then((user) => {
      if(!!user) {
        user.set({token: token});
        user.save();
        resolve(!!token ? 'Success! Registered the user for push notifications' : 'Success! Unregistered the user for push notifications');
      } else {
        reject('invalid user id');
      }
    });
  })
}

// Twilio Helper Methods
// Example usage
// var tempEvent = {name: 'Hack Reactor Social Night', date_time: 'Saturday, May 27, 5:00pm', address: '369 Lexington Ave', city: 'NYC', state: 'NY'};
// var tempUsers = [{phone: '+19734879888'}, {phone: '+17182132839'}, {phone: '+16466411017'}];
// sendEventInvitations(tempEvent, tempUsers);
// sendEventAnnouncement(tempEvent, tempUsers, 'Just Joking, the event has been cancelled');

const _sendMessageToPhone = (phone, message, callback = (res) => res) => {
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

exports.sendCodeToPhone = (phone, profile, message = "To verify your HanginHubs please reply with the following 5 numbers and \'_" + profile.id + "\': \n(e.g. 12345_12)\n") => {
  return twilioAuthService.sendCode(phone, message);
}

exports.authenticatePhoneWithCode = (phone, code) => {
  return twilioAuthService.verifyCode(phone, code);
}

const _sendEventInvitation = (user, message) => {
  _sendMessageToPhone(user.phone, message);
}

exports.sendEventInvitation = (user, message) => {
  _sendMessageToPhone(user.phone, message);
}

exports.sendEventInvitations = (event, users) => {
  const message = `You have been invited an event on HanginHubs! Please go to the website to respond. Event Details: ${event.name} on ${event.date_time} at ${event.address}, ${event.city}, ${event.state}`;
  users.forEach(user => _sendEventInvitation(user, message));
}

exports.sendEventAnnouncement = (event, users, announcement) => {
  const message = `Announcement for upcoming event \'${event.name}\': ${announcement}`;
  users.forEach(user => _sendEventInvitation(user, message));
}

exports.setVerifyPhoneNumber = (id, phone) => {
  helpers.getCurrentUserFromId(id)
  .then(user => {
    user.set({'phone_validated': true});
    user.set({'phone': phone});
    user.save();
  })
}

exports.isPhoneValidated = (phone) => {
  return new Promise(function (resolve, reject) {
    new User({phone: phone, phone_validated: true}).fetch()
      .then((user) => {
        if(!!user) {
          resolve('Phone already validated!');
        } else {
          reject('Phone not validated');
        }
      })
  });
}

