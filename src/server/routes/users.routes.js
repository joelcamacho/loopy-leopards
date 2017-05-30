const routes = require('express').Router();
const helpers = require('../helpers/db.helpers.js');

// GET user data from google id
routes.route('/users/google/:id')
	.get((req, res) => {
		helpers.getCurrentUserFromGoogleId(req.params.id)
		.then(result => res.send(result))
		.catch(err => res.status(400).send({result: err}))
	})

// GET all users and data
// POST, create a new user
routes.route('/users')
	.get((req, res) => {
		helpers.getAllUsers()
		.then(result => res.send(result))
		.catch(err => res.status(400).send({result: err}));
	})
	.post((req, res) => {
	// req.body should contain the following in json format
	// { first_name, last_name, google_id, email, 
	//   password, address, city, state,
	//   latitude, longitude, phone, birthdate, registered }
		const userData = Object.assign({}, req.body)
		helpers.createNewUser(userData)
		.then(result => res.send({result: result}))
		.catch(err => res.status(400).send({result: err}));
	})

// GET specific user's data
routes.route('/users/:id')
	.get((req, res) => {
		helpers.getCurrentUserFromId(req.params.id)
		.then(result => res.send(result))
		.catch(err => res.status(400).send({result: err}))
	})
	// TESTING PURPOSES ONLY
	.delete((req,res) => {
		helpers.deleteCurrentUserFromId(req.params.id)
		.catch(err => res.status(400).send({result: err}))
		.then(result => res.send(result))
	})
	// .put((req,res) => {
	// 	helpers.updateCurrentUserFromId(req.params.id, req.body)
	// 	.catch(err => res.status(400).send({result: err}))
	// 	.then(result => res.send(result))
	// })

// REQUIRES User to be authenticated
// GET current user's data
// PUT current user's data
// DELETE current user
routes.route('/user')
	.get((req, res) => {
		helpers.getUserIdFromGoogleId(req.user ? req.user.id : null)
		.catch(err => res.status(400).send({result: err}))
		.then(id => helpers.getCurrentUserFromId(id))
		.catch(err => res.status(400).send({result: err}))
		.then(result => res.send(result))
	})
	.put((req, res) => {
		// req.body should contain the following in json format
		// { first_name, last_name, google_id, email, 
		//   password, address, city, state,
		//   latitude, longitude, phone, birthdate, registered }
		helpers.getUserIdFromGoogleId(req.user ? req.user.id : null)
		.catch(err => res.status(400).send({result: err}))
		.then(id => helpers.updateCurrentUserFromId(id, req.body))
		.then(result => res.send(result))
		.catch(err => res.status(400).send({result: err}))
	})
	.delete((req,res) => {
		helpers.getUserIdFromGoogleId(req.user ? req.user.id : null)
		.catch(err => res.status(400).send({result: err}))
		.then(id => helpers.deleteCurrentUserFromId(id))
		.catch(err => res.status(400).send({result: err}))
		.then(result => res.send(result))
	})

module.exports = routes