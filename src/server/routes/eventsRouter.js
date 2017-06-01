const router = require('express').Router();
const bookshelf = require('../db/models/db.js');
const User = require('../db/models/user.js');
const Event = require('../db/models/event.js');

router.route('/events')

.get((req,res) => {
	//TODO: get ID
	let id = 1,
	data = {}

	//retrieve all events that the user either created or was invited to
	User.where({id:id}).getAllEvents()
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
			res.status(200).json(data)
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
	// }
	let id = 1,
	eventAttributes = {creator_id: id},
	data = {}

	Object.assign(eventAttributes, req.body);

	new Event(eventAttributes).save(null, null, null, {require:true})
	.then((event) => {
		event.related('invitees').attach(id)
		.catch((err) => {
			data.error = 'Sorry, could not save you as an invitee of this event'
		})
		data.event = event
		res.status(200).json(data);
	})
	.catch((err) => {
		res.status(400).send('Sorry, could not save your event, please try again!')
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
		console.log(err);
		res.status(400).send('Could not delete event');
	});
});

router.post('/events/:id/invite',(req,res) => {

	let Invitees = bookshelf.Collection.extend({model: User});
	let eventId = req.params.id,
	responseData = {alreadyInvited:[]},
	incomingInvitees = req.body.invitees,
	inviteeModelsToAdd;

	//make incoming invitee list into a collection
	let incomingInviteeColl = Invitees.forge(incomingInvitees)
	//Save models in collection into database. This will only save models that aren't duplicates
	incomingInviteeColl.invokeThen('save')
	.catch((err) => {
		console.log(err)
	})

	//fetch any invitees' models from db
	Promise.all(incomingInvitees.map((invitee) => {
		return User.where({phone:invitee.phone}).fetch()
	}))
	.then((newInvitees) => {
		Event.where({id: eventId}).addInvitees(newInvitees)
		.then((result) => {
			res.status(200).send(result)
		})
		.catch((err) => {
			res.status(400).send('Something went wrong with your invitations')
		})
	})
});

router.post('/events/:id/upvote', (req,res) => {

	let userId = 1
	let eventId = req.params.id

	Event.where({id: eventId}).vote(userId, true)
	.then((result) => {
		res.status(200).send('You voted for:' + result.get('name'))
	})
	.catch((err) => {
		console.log(err)
		res.status(400).send('Something went wrong with your vote')
	})
});

router.post('/events/:id/downvote', (req,res) => {

	let userId = 1
	let eventId = req.params.id


	Event.where({id: eventId}).vote(userId, false)
	.then((result) => {
		res.status(200).send(result)
	})
	.catch((err) => {
		console.log(err)
		res.status(400).send('Something went wrong with your vote')
	})
});

module.exports = router;
