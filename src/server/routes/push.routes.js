const routes = require('express').Router();
const apiKeys = require('../config/config.js');
const fetch = require('node-fetch');
const Promise = require('promise');
const User = require('../db/models/user.js');

// Helpers

const getUserIdFromGoogleId = (google_id) => {
  return new Promise(function (resolve, reject) {
    if(google_id === undefined) {
      return reject('invalid google_id');
    }

    new User({google_id: google_id}).fetch()
      .then((user) => {
        if(!!user) {
          console.log('user', user, user.get('id'));
          resolve(user.get('id'));
        } else {
          console.log('invalid google_id');
          reject('invalid google_id');
        }
      });
    });
}

const getUserToken = (id) => {
  return new Promise(function (resolve, reject) {
    new User({id: id}).fetch()
      .then((user) => {
        if(!!user) {
          console.log('user', user, user.get('token'));
          resolve(user.get('token'));
        } else {
          console.log('invalid id');
          reject('invalid id');
        }
      });
    });  
}

const pushToUser = (id, title = 'Kimmy J Master', body = 'I will take over the world! Tomorrow...', icon = 'https://static.seekingalpha.com/uploads/2016/4/957061_14595169907724_rId15.jpg', click_action = 'http://localhost:3000') => {
  const key = apiKeys.fcmServerKey;

  const notification = {
    'title': title,
    'body': body,
    'icon': icon,
    'click_action': click_action
  };

  return new Promise(function (resolve, reject) {
    getUserToken(id).then(to => {
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
          resolve(response);
        }).catch(function(error) {
          reject(error);
        })
      }).catch(err => resolve(error));
    })
}


// Routes

routes.post('/api/push/test', function(req, res) {
  if(!req.user) res.send({result:'unAuthenticated'});

  getUserIdFromGoogleId(req.user.id)
  .catch(err => res.send({result: err}))
  .then(result => getUserToken(result))
  .catch(err => res.send({result: err}))
  .then(result => res.send({result: result}));
});

routes.post('/api/push/register', function(req, res) {
  console.log(JSON.stringify(req.body));
  if(!req.body.token) return res.send({result:'unAuthenticated'});
  if(!req.user) return res.send({result:'unAuthenticated'});

  getUserIdFromGoogleId(req.user.id)
  .catch(err => res.send({result: err}))
  .then(userId => {
    new User({id: userId}).fetch()
    .then((user) => {
      if(!!user) {
        user.set({token: req.body.token});
        user.save();
        res.send({result: 'Success! Registered the user for push notifications'});
      } else {
        console.log('invalid user id');
        res.end({result: 'invalid user id'});
      }
    });
  })
});

routes.post('/api/push/unregister', function(req, res) {
  console.log(JSON.stringify(req.body));
  if(!req.user) return res.send({result:'unAuthenticated'});

  getUserIdFromGoogleId(req.user.id)
  .catch(err => res.send({result: err}))
  .then(userId => {
    new User({id: userId}).fetch()
    .then((user) => {
      if(!!user) {
        user.set({token: null});
        user.save();
        res.send({result: 'Success! Unregistered the user for push notifications'});
      } else {
        console.log('invalid user id');
        res.end({result: 'invalid user id'});
      }
    });
  })
});


routes.post('/api/push/notification', function(req, res) {
  // TO DO: get user id from current session
  // this end point is for testing purposes
  if(!!req.user) {
    getUserIdFromGoogleId(req.user.id)
    .catch(err => res.send({result: err}))
    .then(result => pushToUser(result))
    .catch(err => res.send({result: err}))
    .then(result => res.send({result:result}));
  } else {
    pushToUser(1)
    .catch(err => res.send({result: err}))
    .then(result => res.send({result:result}));
  }
})

module.exports = routes;