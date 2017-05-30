const router = require('express').Router();

const User = require('../db/models/user.js');

router.route('/users')

.get((req, res) => {
	User.fetchAll()
	.then((users) => {
		if(users) {
			res.status(200).json(users)
		} else {
			res.status(200).send('No users registered')
		}
	})
	.catch((err) => {
		console.log(err)
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
	
	Object.assign(userData, req.body)

	User.forge(userData).save()
	.then((user) => {
		if(user.get('email') === null && user.get('google_id') === null) {
			res.status(200).send('added ' + user.get('name'))
		} else {
			res.status(200).send('Welcome, ' + user.get('first_name'));
		}
	})
	.catch((err) => {
		if(err.code = "ER_DUP_ENTRY") {
			res.status(400).send('Uh-oh. It looks like that phone number is already in our system!')
		} else {
			res.status(400).send('Something went wrong, please try again')
		}
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
		res.status(400).send('Error retrieving profile')
	})
})

.put((req, res) => {

	let userId = req.params.id,
	userData = {}

	Object.assign(userData, req.body)

	new User({id:userId}).save(userData, {patch: true})

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