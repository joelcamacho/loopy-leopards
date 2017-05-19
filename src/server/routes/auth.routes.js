const routes = require('express').Router();
const passport = require('passport');

// GET logout to logout out of OAuth for current session
routes.get('/logout', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

// GET auth to checkout current session is authenticated
routes.get('/auth', function (req, res){
  res.send(req.isAuthenticated());
});

module.exports = routes;