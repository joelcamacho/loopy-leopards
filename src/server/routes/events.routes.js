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
		let google_id = req.user ? req.user.id : null;

		if(!google_id) return res.send({result: 'User must be authenticated to get events!'});

		helpers.getUserIdFromGoogleId(google_id)
		.catch(err => res.send({result: err}))
		.then(id => helpers.getCurrentUserEvents(id))
		.catch(err => res.send({result: err}))
		.then(result => res.send(result));
	})
	.post((req,res) => {
		let google_id = req.user ? req.user.id : null;
		let options = req.body;

		if(!google_id) return res.send({result: 'User must be authenticated to get events!'});
		if(!options.name) return res.send({result: "Body must contain event details!"});

		let user_id = null;
		let group_id = null;

		helpers.getUserIdFromGoogleId(google_id)
		.catch(err => res.send({result: err}))
		.then(id => {
			user_id = id;
			return helpers.getCurrentUserGroup(id);
		})
		.then(groups => {
			let currentGroup = groups.groupsBelongingTo.serialize().find(group => group._pivot_status === 'member');

			if(!currentGroup) {
				return helpers.createNewEvent(user_id, null, options);
			} else {
				group_id = currentGroup.id;
				return helpers.createNewEvent(user_id, group_id, options);
			}
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
		// only creator can edit details of this event
		let google_id = req.user ? req.user.id : null;
		let event_id = req.params.id;
		let options = req.body;
		let user_id = null;

		if(!event_id) return res.send({result: 'Params must contain id, /api/events/:id'});
		if(Object.keys(options).length === 0) return res.send({result: 'Body must contain event details!'});
		if(!google_id) return res.send({result: 'User must be authenticated!'});

		helpers.getUserIdFromGoogleId(google_id)
		.catch(err => res.send({result: err}))
		.then(id => {
			user_id = id;
			return helpers.getEventFromId(event_id);
		})
		.catch(err => res.send({result: err}))
		.then(result => {
			if(result.serialize().creator_id === user_id) {
				return helpers.updateEventFromId(event_id, options);
			} else {
				res.send({result: 'User is not creator of this event!'})
			}
		})
		.catch(err => res.send({result: err}))
		.then(result => res.send(result));
	})
	// Testing purposes --- Also, not working 
	// .delete((req, res) => {
	// 	let event_id = req.params.id;

	// 	if(!event_id) return res.send({result: 'Params must contain id, /api/events/:id'});

	// 	helpers.deleteEventFromId(event_id)
	// 	.catch(err => res.send({result: err}))
	// 	.then(result => res.send({result: result}));
	// });


// GET, all invitees to the event
// POST, invite user to event
	// should check all users to see if phone number exists
	// should create a new user entry 'Anonymous' if phonenumber does not exist
	// if exists, invite person to event (create new entry in join table and set status to 'confirmed')
// PUT, accept an existing invitation to event
	// should check to see if user / event vote join table has an entry for this user and the event
	// if exists and the status is currently 'unconfirmed', then set status to 'confirmed'
// DELETE, reject an existing invitation to event
	// should check to see if user / event vote join table has an entry for this user and the event
	// if exists and the status is currently 'invited', then remove the entry from the user / event join table
// Possible areas for sending text messages and notifications via the util helpers
router.route('/events/:id/invitations')
	.get((req,res) => {
		if(!req.params.id) return res.send({result: 'Params must contain id, /api/events/:id'});

		let event_id = req.params.id;

		helpers.getEventFromId(event_id)
		.catch(err => res.send({result: err}))
		.then(result => {
			res.send(result.serialize().invitees)
		});
	})
	.post((req,res) => {
		let google_id = req.user ? req.user.id : null;
		let event_id = req.params.id;
		let phone = req.body.phone;
		let user_id = null;
		let invitees = [];

		if(!google_id) return res.send({result: 'User must be authenticated to invite others to events!'});
		if(!event_id) return res.send({result: 'Params must contain id, /api/events/:id'});
		if(!phone) return res.send({result: 'Body must contain phone field!'});

		helpers.getUserIdFromGoogleId(google_id)
		.catch(err => res.send({result: err}))
		.then(id => {
			user_id = id;
			return helpers.getEventFromId(event_id);
		})
		.catch(err => res.send({result: err}))
		.then(event => {
			invitees = event.serialize().invitees;
			
			let isInvitee = invitees.find(user => user.id === user_id);

			if(!isInvitee) {
				res.send({result: 'User is not a part of the event!'});
			} else {
				return helpers.getAllUsers();
			}
		})
		.then(users => {
			let allUsers = users.serialize();

			let userFromPhone = allUsers.find(user => user.phone === phone);

			if(userFromPhone) {
				return userFromPhone;
			} else {
				let options = {first_name: 'Anonymous', phone: phone}
				return helpers.createNewUser(options);
			}
		})
		.catch(err => res.send(err))
		.then(user => {
			return helpers.requestORInviteToJoinEvent(user.id, event_id);
		})
		.catch(err => res.send({result: err}))
		.then(result => res.send({result: result}));
	})
	.put((req,res) => {
		let google_id = req.user ? req.user.id : null;
		let event_id = req.params.id;
		let user_id = null;
		let invitees = [];

		if(!google_id) return res.send({result: 'User must be authenticated to invite others to events!'});
		if(!event_id) return res.send({result: 'Params must contain id, /api/events/:id'});

		helpers.getUserIdFromGoogleId(google_id)
		.catch(err => res.send({result: err}))
		.then(id => {
			user_id = 2;
			return helpers.getEventFromId(event_id);
		})
		.catch(err => res.send({result: err}))
		.then(event => {
			invitees = event.serialize().invitees;

			let isInvitee = invitees.find(user => user.id === user_id);

			if(!isInvitee) {
				res.send({result: 'User is not invited to this event!'});
			} else {
				if (isInvitee._pivot_status === 'unconfirmed') {
					return helpers.acceptInvitationToJoinEvent(user_id, event_id);
				} else {
					res.send({result: 'User has already been confirmed!'})
				}
			}
		})
		.catch(err => res.send({result: err}))
		.then(result => res.send({result: result}));
	})
	.delete((req,res) => {
		let google_id = req.user ? req.user.id : null;
		let event_id = req.params.id;
		let user_id = null;
		let invitees = [];

		if(!google_id) return res.send({result: 'User must be authenticated to invite others to events!'});
		if(!event_id) return res.send({result: 'Params must contain id, /api/events/:id'});

		helpers.getUserIdFromGoogleId(google_id)
		.catch(err => res.send({result: err}))
		.then(id => {
			user_id = id;
			return helpers.getEventFromId(event_id);
		})
		.catch(err => res.send({result: err}))
		.then(event => {
			invitees = event.serialize().invitees;

			let isInvitee = invitees.find(user => user.id === user_id);

			if(!isInvitee) {
				res.send({result: 'User is not invited to this event!'});
			} else {
				if (isInvitee._pivot_status === 'unconfirmed') {
					return helpers.rejectInvitationToJoinEvent(user_id, event_id);
				} else {
					res.send({result: 'User has already been confirmed!'})
				}
			}
		})
		.catch(err => res.send({result: err}))
		.then(result => res.send({result: result}));
	});

// POST, broadcast a message to all members of the event that are 'confirmed' (status 'confirmed')
	// should check to see if user is the creator of the event
	// should get a list of all members of the event 
	// should get a list of members that are 'confirmed' 
	// should send text messages and notifications via the util helpers to those members
router.post('/events/:id/broadcast',(req,res) => {
	let google_id = req.user ? req.user.id : null;
	let user_id = null;
	let event_id = req.params.id;
	let options = req.body;
	let invitees = [];

	if(!google_id) return res.send({result: 'User must be authenticated to invite others to events!'});
	if(!event_id) return res.send({result: 'Params must contain id, /api/events/:id'});
	if(!options.body) return res.send({result: 'Body must contain broadcast details! {title, body}'});

	helpers.getUserIdFromGoogleId(google_id)
	.catch(err => res.send({result: err}))
	.then(id => {
		user_id = id;
		return helpers.getEventFromId(event_id);
	})
	.catch(err => res.send({result: err}))
	.then(event => {
		invitees = event.serialize().invitees;
		let confirmedInvitees = invitees.filter(user => user._pivot_status === 'confirmed');

		if(event.serialize().creator_id !== user_id) {
			res.send({result: 'User is not creator of this event!'});
		} else {
			util.pushToUsers(confirmedInvitees, options);
			util.sendEventAnnouncement(event.serialize(), confirmedInvitees, options.body);
			res.send({result: 'Broadcast sent!'});
		}
	});
});

module.exports = router;



/**********************************************
*
* Voting for Events isn't necessary, we can
* use confirmed and unconfirmed status to det-
* ermine the votes...
* 
**********************************************/

// POST, vote for an event
	// should to see if current user is a member of the event
	// should add an entry in user / event voted join table if it does not exist
	// if exists, just update the voted property
// Possible areas for sending text messages and notifications via the util helpers

// router.post('/events/:id/upvote', (req,res) => {
// 	if(!req.user || !req.user.id) return res.send({result: 'User must be authenticated to invite others to events!'});
// 	if(!req.params.id) return res.send({result: 'Params must contain id, /api/events/:id'});

// 	let user_id = req.user.id;
// 	let event_id = req.params.id;

// 	helpers.getEventFromId(event_id)
// 	.catch(err => res.send({result: err}))
// 	.then(event => helpers.getGroup(event.group_id))
// 	.catch(err => res.send({result: err}))
// 	.then(group => {
// 		let found = false;

// 		if(group.creator.id === user_id) found = true;

// 		group.members.forEach(user => {
// 			if(user.id === user_id) found = true;
// 		});

// 		if(found) {
// 			return helpers.getAllUsers();
// 		} else {
// 			res.send({result: 'User is not a member of this group or event!'});
// 		}
// 	})
// 	.catch(err => res.send({result: err}))
// 	.then(users => {
// 		let profile = users.find(user => user.id === user_id);

// 		if(profile === undefined) {
// 			return res.send({result: 'User is not a member of this event!'});
// 		} else {
// 			return profile;
// 		}
// 	})
// 	.then(user => helpers.voteForEvent(user.id, event_id))
// 	.catch(err => res.send({result: err}))
// 	.then(result => res.send({result: result}));
// });

// POST, remove vote for an event
	// should to see if current user is a member of the event
	// should add an entry in user / event voted join table if it does not exist
	// if exists, just update the voted property
// Possible areas for sending text messages and notifications via the util helpers

// router.post('/events/:id/downvote', (req,res) => {
// 	if(!req.user || !req.user.id) return res.send({result: 'User must be authenticated to invite others to events!'});
// 	if(!req.params.id) return res.send({result: 'Params must contain id, /api/events/:id'});

// 	let user_id = req.user.id;
// 	let event_id = req.params.id;

// 	helpers.getEventFromId(event_id)
// 	.catch(err => res.send({result: err}))
// 	.then(event => helpers.getGroup(event.group_id))
// 	.catch(err => res.send({result: err}))
// 	.then(group => {
// 		let found = false;

// 		if(group.creator.id === user_id) found = true;

// 		group.members.forEach(user => {
// 			if(user.id === user_id) found = true;
// 		});

// 		if(found) {
// 			return helpers.getAllUsers();
// 		} else {
// 			res.send({result: 'User is not a member of this group or event!'});
// 		}
// 	})
// 	.catch(err => res.send({result: err}))
// 	.then(users => {
// 		let profile = users.find(user => user.id === user_id);

// 		if(profile === undefined) {
// 			return res.send({result: 'User is not a member of this event!'});
// 		} else {
// 			return profile;
// 		}
// 	})
// 	.then(user => helpers.unvoteForEvent(user.id, event_id))
// 	.catch(err => res.send({result: err}))
// 	.then(result => res.send({result: result}));
// });

