const router = require('express').Router();

const User = require('../db/models/user.js');
const Event = require('../db/models/event.js');

router.route('/events')

.get((req,res) => {
	//TODO: get ID
	let id = 1,
	data = {}

	//retrieve all events that the user either created or was invited to
	User.where({id:id}).getEvents()
	.then((results) => {
		Promise.all(results.invitedTo.map((event) => {
			return event.where({id:event.id}).getInfo()
		}))
		.then((result) => {
			data.invitedTo = result
		})
		.catch((err) => {
			res.status(400).send('Something went wrong')
		})
		Promise.all(results.created.map((event) => {
			return event.where({id:event.id}).getInfo()
		}))
		.then((result) => {
			data.created = result
			res.send(data)
		})
		.catch((err) => {
			res.status(400).send('Something went wrong')
		})
	})
	.catch((err) => {
		res.status(400).send('Something went wrong in fetching your events')
	})
})

.post((req,res) => {
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

	let id = 1,
	eventAttributes = {creator_id: id};

	Object.assign(eventAttributes, req.body);

	new Event(eventAttributes).save()
	.then((event) => {
		res.status(200).json({'Event saved: ': event});
	})
	.catch((err) => {
		console.log(err)
		res.status(400).send('Could not save your event')
	})
})

router.route('/events/:id')

.get((req,res) => {
	
	let eventId = req.params.id, data = {}

	Event.where({id:eventId}).fetch({withRelated: ['group', 'invitees']})
	.then((event) => {
		if(event) {
			res.status(200).json(event)
		} else {
			res.status(400).send('Uh-oh, looks like this event doesn\'t exist')
		}
	})
	.catch((err) => {
		console.log(err)
		res.status(400).send('Error retrieving this event' + err)
	})
})

.put((req,res) => {

	let eventId = req.params.eventId,
	updateAttributes = {};

	Object.assign(updateAttributes, req.body)

	new Event({id:eventId}).save(updateAttributes, {patch: true})
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

router.post('/events/:id/invite',(req,res) => {

	let eventId = req.params.id,
	inviteeModelArray = []

	//convert each user into a User model instance
	

})

router.post('/events/:id/vote')

module.exports = router;
