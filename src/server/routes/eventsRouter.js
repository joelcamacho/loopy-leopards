const router = require('express').Router();

const User = require('../db/models/user.js');
const Event = require('../db/models/event.js');

router.route('/events')

.get((req,res) => {
	//TODO: get ID
	let id = 1,
	data = {}

	//retrieve all events that the user either created or was invited to
	User.where({id:id}).fetch({withRelated: ['invitedTo','created']})
	.then((result) => {
		if(result) {
			data.invitedTo = result.related('invitedTo')
			data.created = result.related('created')
			res.status(200).json(data);
		} else {
			res.status(200).send('You have no active events')
		}
	})
	.catch((err) => {
		res.status(400).send('Something went wrong in fetching your events')
	})
})

.post((req,res) => {

	let id = 1,
	eventAttributes = {creator_id: id};

	for(var key in req.body) {
		eventAttributes[key] = req.body[key];
	}

	new Event(eventAttributes).save()
	.then((event) => {
		res.status(200).json({'Event saved: ': event});
	})
	.catch((err) => {
		console.log(err)
		res.status(400).send('Could not save your event')
	})
})

.put((req, res) => {

	let eventId = req.params.eventId,
	updateAttributes = {};

	// {
	// 	name:
	// 	date_time:
	// 	description:
	// 	address:
	// 	city:
	// 	state:
	// 	phone:
	// 	latitute:
	// 	longitude:
	// 	cost:
	// 	voting_deadline:
	// 	creator_id:
	// }

	for(var key in req.body) {
		updateAttributes[key] = req.body[key]
	}

	new Event({id:id}).save(updateAttributes, {patch: true})
	.then((event) => {
		res.send(200).json({'Event updated: ': event})
	})
	.catch((err) => {
		console.log(err)
		res.status(400).send('Could not update event')
	})
})

.delete((req, res) => {
	
	let eventId = req.params.eventId

	new Event({id: eventId}).destroy()
	.then((event) => {
		res.send(200).json({'Event deleted: ': event});
	})
	.catch((err) => {
		console.log(err)
		res.status(400).send('Could not delete event');
	})
})

module.exports = router;
