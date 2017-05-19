const router = require('express').Router();

let User = require('../db/models/activity.js');

router.route('/activities')

.get((req,res) => {

	let userId = 1; //obtain from auth

	User.where({id: userId}).fetch({withRelated: ['posts.tags']})
      .then(function(user) {
          console.log(user.related('posts'));
          res.json(user);
      })
      .catch(function(err) {
          return next(new Error(err));
      });
})