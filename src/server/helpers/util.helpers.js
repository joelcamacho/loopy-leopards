const apiKeys = require('../config/config.js');
const fetch = require('node-fetch');
const Promise = require('promise');
const User = require('../db/models/user.js');
const helpers = require('../helpers/db.helpers.js');

// TODO: add all twilio text messaging helper methods

// TODO: add all FCM push notification helper methods
exports.pushToUserFromId = (id, options = {}) => {
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
