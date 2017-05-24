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

router.route('/users/google/:id')

.get((req, res) => {
	let userId = req.params.id

	User.forge({google_id: userId}).fetch()
	.then((user) => {
		res.status(200).send(user)
	})
	.catch((err) => {
		console.log(err)
		res.status(400).send('Error retrieving user')
	})
})

router.route('/users/:id')

.get((req, res) => {
	let userId = req.params.id

	User.forge({id: userId}).fetch()
	.then((user) => {
		res.status(200).send(user)
	})
	.catch((err) => {
		console.log(err)
		res.status(400).send('Error retrieving user')
	})
})

.put((req, res) => {

	let userId = req.params.id,
	userData = {}

	for(var key in req.body) {
		userData[key] = req.body[key]
	}

	new User({id:userId}).save(userData, {patch: true})
	// .then((event) => {
	// 	return res.send(200).json({'Event updated: ': event});
	// })
	// .catch((err) => {
	// 	console.log(err)
	// 	return  res.status(400).send('Could not update event');
	// })
})

module.exports = router