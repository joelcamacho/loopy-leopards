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
		console.log(req.body)
		let google_id = req.user ? req.user.id : null;
		let options = req.body;
		let user_id = null;
		let group_id = null;
		let user_name = null;

		if(!google_id) return res.send({result: 'User must be authenticated to post events!'});
		if(!options.name) return res.send({result: "Body must contain event details!"});

		helpers.getCurrentUserFromGoogleId(google_id)
		.then(user => {
			user_id = user.serialize().id;
			user_name = user.serialize().first_name;
			return helpers.getCurrentUserGroup(user_id);
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
		.then(result => {
			if(!!group_id) {
				return helpers.getGroup(group_id);
			} else {
				res.send({result: 'You have created an event!'});
			}
		})
		.catch(err => res.send({result: err}))
		.then(result => {
			let message = user_name +' has created an event called ' + options.name + '! Please log on to HanginHubs to vote for this event!';

			// SEND TEXT MESSAGE TO PHONE
			util.sendEventInvitations(result.serialize().members, message);

			// SEND NOTIFICATION TO MEMBERS OF THIS GROUP
			util.pushToUsers(result.serialize().members, {
				body: message
			});

			res.send({result: 'You have created an event!'});
		})
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
		let user_name = null;
		let members = [];
		let event_details = {};

		if(!event_id) return res.send({result: 'Params must contain id, /api/events/:id'});
		if(Object.keys(options).length === 0) return res.send({result: 'Body must contain event details!'});
		if(!google_id) return res.send({result: 'User must be authenticated!'});

		helpers.getCurrentUserFromGoogleId(google_id)
		.then(user => {
			user_id = user.serialize().id;
			user_name = user.serialize().first_name;
			return helpers.getEventFromId(event_id);
		})
		.catch(err => res.send({result: err}))
		.then(result => {
			event_details = result ? result.serialize() : null;

			if(event_details.creator_id === user_id) {

				members = event_details.invitees.filter(user => user._pivot_status === 'confirmed');

				return helpers.updateEventFromId(event_id, options);
			} else {
				res.send({result: 'User is not creator of this event!'})
			}
		})
		.catch(err => res.send({result: err}))
		.then(result => {
			let stringedOptions = "";
			Object.keys(options).forEach(key => stringedOptions += key + ": " + options[key] + "\n");

			let message = user_name +' has updated event' + event_details.name + '! Details: \n' + stringedOptions;

			// SEND NOTIFICATION TO MEMBERS OF THIS GROUP
			util.pushToUsers(members, {
				body: message
			});

			res.send(result)
		});
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
		let event_details = {};

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
			event_details = event.serialize();
			invitees = event_details.invitees;
			
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
		.then(result => {

			// SEND TEXT MESSAGE TO PHONE
			util.sendMessageToPhone(phone, 'You have been invited to join an event, ' + event_details.name + ', on Hanginhubs. Please log in to vote for this event!');

			res.send({result: result});
		});
	})
	.put((req,res) => {
		let google_id = req.user ? req.user.id : null;
		let event_id = req.params.id;
		let user_id = null;
		let user_name = null;
		let invitees = [];
		let event_details = {};
		let failed = false;

		if(!google_id) return res.send({result: 'User must be authenticated to invite others to events!'});
		if(!event_id) return res.send({result: 'Params must contain id, /api/events/:id'});

		helpers.getCurrentUserFromGoogleId(google_id)
		.then(user => {
			user_id = user.serialize().id;
			user_name = user.serialize().first_name;
			return helpers.getEventFromId(event_id);
		})
		.catch(err => res.send({result: err}))
		.then(event => {
			event_details = event.serialize();

			invitees = event_details.invitees;

			let isInvitee = invitees.find(user => user.id === user_id);

			if(!isInvitee) {
				failed = true;
				res.send({result: 'User is not invited to this event!'});
			} else {
				if (isInvitee._pivot_status === 'unconfirmed') {
					return helpers.acceptInvitationToJoinEvent(user_id, event_id);
				} else {
					failed = true;
					res.send({result: 'User has already been confirmed!'})
				}
			}
		})
		.catch(err => res.send({result: err}))
		.then(result => {
			if(!failed) {
				invitees = invitees.filter(user => user._pivot_status === 'confirmed');

				let message = user_name +' has voted for event, ' + event_details.name + '!';

				// SEND NOTIFICATION TO MEMBERS OF THIS EVENT
				util.pushToUsers(invitees, {
					body: message
				});
			}
			res.send({result: result});
		});
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

// POST, set current event status as confirmed and all conflicting event date/time status to inactive
    // current user should be the creator of the event
    // event must be status 'suggested'
    // event must have majority of group members confirmed for this event
        // check event's group
        // get status
        // if number of confirmed is greater than 50% of members of the group
        // then continue...
    // set event status to confirmed
    // find all events for this group
    // get all events where date conflicts with event
        // compare day of the datetime 
    // set status for those events to inactive
// Possible areas for sending text messages and notifications via the util helpers
router.post('/events/:id/confirm',(req,res) => {
	let google_id = req.user ? req.user.id : null;
	let user_id = null;
	let user_name = null;
	let event_id = req.params.id;
	let event_details = {};
	let invitees = null;
	let group_events = null;
	let confirmedEvent_dateTime = null;
	let failed = false;

	if(!google_id) return res.send({result: 'User must be authenticated to invite others to events!'});
	if(!event_id) return res.send({result: 'Params must contain id, /api/events/:id'});

	helpers.getCurrentUserFromGoogleId(google_id)
	.then(user => {
		user_id = user.serialize().id;
		user_name = user.serialize().first_name;
		return helpers.getCurrentUserEvents(user_id)
	})
	.then(events => {
		let isFound = events.created.find(event => {
			return event.id == event_id
		})

		if(!isFound) {
			failed = true;
			return res.send('That event was not found')
		} else if (isFound.status === 'suggested') {
			invitees = isFound.invitees;
			event_details = isFound;
			confirmedEvent_dateTime = isFound.date_time;

			return helpers.getGroup(isFound.group_id)
		} else {
			failed = true;
			return res.send('Event needs to have a "suggested" status to be confirmed')
		}
	})
	.then(group => {
		let members = group.serialize().members.filter(user => {
			return user._pivot_status === 'member';
		})
		.map(member => member.id)

		let membersFromInvitees = invitees.filter(user => {
			return members.includes(user.id)
		})

		let groupSize = membersFromInvitees.length;

		group_events = group.serialize().events;

		let confirmedSize = membersFromInvitees.filter(member => {
			return member._pivot_status === 'confirmed'
		}).length;

		if (confirmedSize >= (groupSize * 0.5)) {
			return helpers.updateEventFromId(event_id, {status: 'confirmed'})
		} else {
			failed = true;
			res.send('Not enough people confirmed for this event')
		}
	})
	.then(result => {
		if(!confirmedEvent_dateTime) {
			return true;
		} else {
			let date = new Date(Date.parse(confirmedEvent_dateTime)).toJSON().slice(0,10);

			let conflictingEvents = group_events.filter(event => {
				if(!event.date_time) return false;
				if(event.id == event_id) return false;
				let currDate = new Date(Date.parse(event.date_time)).toJSON().slice(0,10)
				return date.toString() === currDate.toString();
			});

			let updateConflicts = conflictingEvents.map(event => {
				return helpers.updateEventFromId(event.id, {status: 'inactive'});
			});

			return Promise.all(updateConflicts);
		}
	})
	.catch(err => res.send(err))
	.then(result => {

		if(!failed) {
			let confirmedInvitees = invitees.filter(user => user._pivot_status === 'confirmed');

			let options = {
				body: user_name + ' has confirmed event, ' + event_details.name + ', for ' + event_details.date_time + '! Please log on to HanginHubs to see details! Enjoy your hangout!' 
			}

			util.pushToUsers(confirmedInvitees, options);
			util.sendEventInvitations(confirmedInvitees, options.body);
		}
		res.send(result);
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

