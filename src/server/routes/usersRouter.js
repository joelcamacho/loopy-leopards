const router = require('express').Router();

const User = require('../db/models/user.js');

router.route('/users')

.get((req, res) => {
	User.fetchAll()
	.then((users) => {
		res.status(200).json(users)
	})
	.catch((err) => {
		consoe.log(err)
		res.status(400).send('Could not retrieve users')
	})
})

.post((req, res) => {

	// {
	// 	first_name:
	// 	last_name:
	// 	google_id:
	// 	email:
	// 	password:
	// 	address:
	// 	city:
	// 	state:
	// 	latitude:
	// 	longitude:
	// 	phone:
	// 	birthdate:
	// 	registered:
	// }

	let userData = {}
	
	for(var key in req.body) {
		userData[key] = req.body[key];
	}

	User.forge(userData).save()
	.then((user) => {
		if(user.get('email') === null && user.get('google_id') === null) {
			res.status(200).send('added ' + user.get('name'))
		} else {
			res.status(200).send('Welcome, ' + user.get('name'));
		}
	})
	.catch((err) => {
		console.log(err.clientError)
		res.status(400).send(err.clientError)
	})
})

router.route('/profile')

.get((req, res) => {

	let userId = 1

	User.forge({id: userId}).fetch()
	.then((user) => {
		res.status(200).send(user)
	})
	.catch((err) => {
		console.log(err)
		res.status(400).send('Error retrieving profile')
	})
})

.put((req, res) => {

	let userId = 1,

	userData = {}

	for(var key in req.body) {
		userData[key] = req.body[key]
	}

	new User({id:userId}).save(updateAttributes, {patch: true})
	.then((user) => {
		res.send(200).json('Profile updated')
	})
	.catch((err) => {
		console.log(err)
		res.status(400).send('Could not update event')
	})
})

.delete((req,res) => {

	let userId = req.params.id

	new User({id:id}).destroy()
	.then((user) => {
		res.send(200).send('Sorry to see you go, ' + user.get('name'))
	})
	.catch((err) => {
		console.log(err)
		res.status(400).send('Could not close account')
	})
})

module.exports = router