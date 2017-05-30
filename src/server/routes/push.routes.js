const routes = require('express').Router();
const util = require('../helpers/util.helpers.js');
const helpers = require('../helpers/db.helpers.js');

// Registers User's token inside request body {token: *****}
routes.post('/api/push/register', function(req, res) {
  if(!req.body.token) return res.send({result:'No Token found in body'});
  if(!req.user) return res.send({result:'unAuthenticated'});
  helpers.getUserIdFromGoogleId(req.user.id)
  .catch(err => res.send({result: err}))
  .then(userId => util.updateUserTokenFromId(userId, req.body.token))
  .catch(err => res.status(400).send({result: err}))
  .then(result => res.send({result: result}));
});

// Unregisters User's token
routes.post('/api/push/unregister', function(req, res) {
  if(!req.user) return res.send({result:'unAuthenticated'});
  helpers.getUserIdFromGoogleId(req.user.id)
  .catch(err => res.send({result: err}))
  .then(userId => util.updateUserTokenFromId(userId, null))
  .catch(err => res.status(400).send({result: err}))
  .then(result => res.send({result: result}));
});

// Send example push notification to current user or to first user
// Only for testing purposes
routes.post('/api/push/notification', function(req, res) {
  if(!!req.user) {
    helpers.getUserIdFromGoogleId(req.user.id)
    .catch(err => res.send({result: err}))
    .then(id => util.pushToUserFromId(id))
    .catch(err => res.send({result: err}))
    .then(result => res.send({result:result}));
  } else {
    util.pushToUserFromId(1)
    .catch(err => res.send({result: err}))
    .then(result => res.send({result:result}));
  }
})

module.exports = routes;