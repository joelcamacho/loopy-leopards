const router = require('express').Router();
const helpers = require('../helpers/db.helpers.js');
const util = require('../helpers/util.helpers.js');

// GET all events user has created or was invited to
	// details for each event should contain list of guest phone numbers and group info and members profiles
// POST, create a new event with options and set user to create of the event
	// should set group to user's current group
	// should set event status to 'suggested'
	// should invite all members of the group after creating event
	// should invite all guest phone numbers after creating event
// Possible areas for sending text messages and notifications via the util helpers
router.route('/events')
	.get((req,res) => {
		if(!req.user || !req.user.id) return res.send({result: 'User must be authenticated to get events!'});
		helpers.getUserIdFromGoogleId(req.user.id)
		.catch(err => res.send({result: err}))
		.then(id => helpers.getCurrentUserEvents(id))
		.catch(err => res.send({result: err}))
		.then(result => res.send(result));
	})
	.post((req,res) => {
		if(!req.user || !req.user.id) return res.send({result: 'User must be authenticated to get events!'});
		if(!req.body) return res.send({result: "Body must contain event details!"});

		let user_id = null;
		let group_id = null;
		let options = req.body;

		helpers.getUserIdFromGoogleId(req.user.id)
		.catch(err => res.send({result: err}))
		.then(id => {
			user_id = id;
			return helpers.getCurrentUserGroup(id);
		})
		.catch(err => res.send(err))
		.then(id => {
			group_id = id;
			return helpers.createNewEvent(user_id, group_id, options);
		})
		.catch(err => res.send(err))
		.then(result => res.send(result));
	})

// GET specific event details given id
	// details for each event should contain list of guest phone numbers and group info and members profiles
// PUT, update an event with options
// DELETE, delete an event from the database
router.route('/events/:id')
	.get((req,res) => {
		if(!req.params.id) return res.send({result: 'Params must contain id, /api/events/:id'});

		let event_id = req.params.id;

		helpers.getEventFromId(event_id)
		.catch(err => res.send({result: err}))
		.then(result => res.send(result));
	})
	.put((req,res) => {
		if(!req.params.id) return res.send({result: 'Params must contain id, /api/events/:id'});
		if(!req.body) return res.send({result: 'Body must contain event details!'});

		let event_id = req.params.id;
		let options = req.body;

		helpers.updateEventFromId(event_id, options)
		.catch(err => res.send({result: err}))
		.then(result => res.send(result));
	})
	// Testing purposes 
	.delete((req, res) => {
		if(!req.params.id) return res.send({result: 'Params must contain id, /api/events/:id'});

		let event_id = req.params.id;

		helpers.deleteEventFromId(event_id)
		.catch(err => res.send({result: err}))
		.then(result => res.send({result: result}));
	});

// POST, invite user to event
	// should check all users to see if phone number exists
	// should create a new user entry 'Anonymous' if phonenumber does not exist
	// if exists, invite person to event (create new entry in join table and set status to 'invited')
// Possible areas for sending text messages and notifications via the util helpers
router.post('/events/:id/invite',(req,res) => {
	if(!req.user || !req.user.id) return res.send({result: 'User must be authenticated to invite others to events!'});
	if(!req.params.id) return res.send({result: 'Params must contain id, /api/events/:id'});
	if(!req.body) return res.send({result: 'Body must contain user details!'});
	if(!req.body.phone) return res.send({result: 'Body must contain phone field!'});

	let user_id = req.user.id;
	let event_id = req.params.id;
	let phone = req.body.phone;

	helpers.getEventFromId(event_id)
	.catch(err => res.send({result: err}))
	.then(event => helpers.getGroup(event.group_id))
	.catch(err => res.send({result: err}))
	.then(group => {
		let found = false;

		if(group.creator.id === user_id) found = true;

		group.members.forEach(user => {
			if(user.id === user_id) found = true;
		});

		if(found) {
			return helpers.getAllUsers();
		} else {
			res.send({result: 'User is not a member of this event!'});
		}
	})
	.catch(err => res.send({result: err}))
	.then(users => {
		let profile = users.find(user => user.phone === phone);

		if(profile === undefined) {
			let options = {name: 'Anonymous', phone: phone}
			return helpers.createNewUser(options);
		} else {
			return profile;
		}
	})
	.catch(err => res.send({result: err}))
	.then(user => helpers.requestORInviteToJoinEvent(user.id, event_id))
	.catch(err => res.send({result: err}))
	.then(result => res.send({result: result}));
});

// POST, accept an existing invitation to event
	// should check to see if user / event vote join table has an entry for this user and the event
	// if exists and the status is currently 'invited', then set status to 'going'
// Possible areas for sending text messages and notifications via the util helpers
router.post('/events/:id/accept',(req,res) => {
	if(!req.user || !req.user.id) return res.send({result: 'User must be authenticated to invite others to events!'});
	if(!req.params.id) return res.send({result: 'Params must contain id, /api/events/:id'});

	let user_id = req.user.id;
	let event_id = req.params.id;

	helpers.getEventFromId(event_id)
	.catch(err => res.send({result: err}))
	.then(event => helpers.getGroup(event.group_id))
	.catch(err => res.send({result: err}))
	.then(group => {
		let found = false;

		if(group.creator.id === user_id) found = true;

		group.members.forEach(user => {
			if(user.id === user_id) found = true;
		});

		if(found) {
			return helpers.getAllUsers();
		} else {
			res.send({result: 'User is not a member of this group or event!'});
		}
	})
	.catch(err => res.send({result: err}))
	.then(users => {
		let profile = users.find(user => user.id === user_id);

		if(profile === undefined) {
			return res.send({result: 'User is not a member of this event!'});
		} else {
			return profile;
		}
	})
	.then(user => helpers.acceptInvitationToJoinEvent(user.id, event_id))
	.catch(err => res.send({result: err}))
	.then(result => res.send({result: result}));
});

// POST, reject an existing invitation to event
	// should check to see if user / event vote join table has an entry for this user and the event
	// if exists and the status is currently 'invited', then remove the entry from the user / event join table
// Possible areas for sending text messages and notifications via the util helpers
router.post('/events/:id/reject',(req,res) => {
	if(!req.user || !req.user.id) return res.send({result: 'User must be authenticated to invite others to events!'});
	if(!req.params.id) return res.send({result: 'Params must contain id, /api/events/:id'});

	let user_id = req.user.id;
	let event_id = req.params.id;

	helpers.getEventFromId(event_id)
	.catch(err => res.send({result: err}))
	.then(event => helpers.getGroup(event.group_id))
	.catch(err => res.send({result: err}))
	.then(group => {
		let found = false;

		if(group.creator.id === user_id) found = true;

		group.members.forEach(user => {
			if(user.id === user_id) found = true;
		});

		if(found) {
			return helpers.getAllUsers();
		} else {
			res.send({result: 'User is not a member of this group or event!'});
		}
	})
	.catch(err => res.send({result: err}))
	.then(users => {
		let profile = users.find(user => user.id === user_id);

		if(profile === undefined) {
			return res.send({result: 'User is not a member of this event!'});
		} else {
			return profile;
		}
	})
	.then(user => helpers.rejectInvitationToJoinEvent(user.id, event_id))
	.catch(err => res.send({result: err}))
	.then(result => res.send({result: result}));
});

// POST, vote for an event
	// should to see if current user is a member of the event
	// should add an entry in user / event voted join table if it does not exist
	// if exists, just update the voted property
// Possible areas for sending text messages and notifications via the util helpers

router.post('/events/:id/upvote', (req,res) => {
	if(!req.user || !req.user.id) return res.send({result: 'User must be authenticated to invite others to events!'});
	if(!req.params.id) return res.send({result: 'Params must contain id, /api/events/:id'});

	let user_id = req.user.id;
	let event_id = req.params.id;

	helpers.getEventFromId(event_id)
	.catch(err => res.send({result: err}))
	.then(event => helpers.getGroup(event.group_id))
	.catch(err => res.send({result: err}))
	.then(group => {
		let found = false;

		if(group.creator.id === user_id) found = true;

		group.members.forEach(user => {
			if(user.id === user_id) found = true;
		});

		if(found) {
			return helpers.getAllUsers();
		} else {
			res.send({result: 'User is not a member of this group or event!'});
		}
	})
	.catch(err => res.send({result: err}))
	.then(users => {
		let profile = users.find(user => user.id === user_id);

		if(profile === undefined) {
			return res.send({result: 'User is not a member of this event!'});
		} else {
			return profile;
		}
	})
	.then(user => helpers.voteForEvent(user.id, event_id))
	.catch(err => res.send({result: err}))
	.then(result => res.send({result: result}));
});

// POST, remove vote for an event
	// should to see if current user is a member of the event
	// should add an entry in user / event voted join table if it does not exist
	// if exists, just update the voted property
// Possible areas for sending text messages and notifications via the util helpers

router.post('/events/:id/downvote', (req,res) => {
	if(!req.user || !req.user.id) return res.send({result: 'User must be authenticated to invite others to events!'});
	if(!req.params.id) return res.send({result: 'Params must contain id, /api/events/:id'});

	let user_id = req.user.id;
	let event_id = req.params.id;

	helpers.getEventFromId(event_id)
	.catch(err => res.send({result: err}))
	.then(event => helpers.getGroup(event.group_id))
	.catch(err => res.send({result: err}))
	.then(group => {
		let found = false;

		if(group.creator.id === user_id) found = true;

		group.members.forEach(user => {
			if(user.id === user_id) found = true;
		});

		if(found) {
			return helpers.getAllUsers();
		} else {
			res.send({result: 'User is not a member of this group or event!'});
		}
	})
	.catch(err => res.send({result: err}))
	.then(users => {
		let profile = users.find(user => user.id === user_id);

		if(profile === undefined) {
			return res.send({result: 'User is not a member of this event!'});
		} else {
			return profile;
		}
	})
	.then(user => helpers.unvoteForEvent(user.id, event_id))
	.catch(err => res.send({result: err}))
	.then(result => res.send({result: result}));
});

// POST, broadcast a message to all members of the event that are 'going' (status 'going')
	// should check to see if user is the creator of the event
	// should check to see if user is the creator of the group
	// should get a list of all members of the event 
	// should get a list of members that are 'going' 
	// should send text messages and notifications via the util helpers to those members
router.post('/events/:id/broadcast',(req,res) => {
	if(!req.user || !req.user.id) return res.send({result: 'User must be authenticated to invite others to events!'});
	if(!req.params.id) return res.send({result: 'Params must contain id, /api/events/:id'});
	if(!req.body) return res.send({result: 'Body must contain broadcast details!'});

	let user_id = req.user.id;
	let event_id = req.params.id;
	let event_details = null;
	let members = null;
	let creator = null;
	let options = req.body;

	helpers.getEventFromId(event_id)
	.catch(err => res.send({result: err}))
	.then(event => {
		event_details = event;
		return helpers.getGroup(event.group_id)
	})
	.catch(err => res.send({result: err}))
	.then(group => {
		let found = false;

		creator = group.creator;
		members = group.members.filter(user => user.status === 'confirmed');

		if(group.creator.id === user_id) found = true;

		group.members.forEach(user => {
			if(user.id === user_id) found = true;
		});

		if(found) {
			return helpers.getAllUsers();
		} else {
			res.send({result: 'User is not a member of this group or event!'});
		}
	})
	.catch(err => res.send({result: err}))
	.then(users => {
		let profile = users.find(user => user.id === user_id);

		if(profile === undefined) {
			return res.send({result: 'User is not a member of this event!'});
		} else {
			return profile;
		}
	})
	.then(user => {
		if(user) {
			members.push(user);

			util.pushToUsers(members, options);
			util.sendEventAnnouncement(event_details, members, options.body);
			res.send({result: 'Successful broadcast'});
		} else {
			res.send({result: 'Failed broadcast'});
		}
	})
});

module.exports = router;
