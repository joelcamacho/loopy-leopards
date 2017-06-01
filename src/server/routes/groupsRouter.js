const router = require('express').Router();

// TODO: Remove all database access
const Group = require('../db/models/group.js');
const User = require('../db/models/user.js');
const Event = require('../db/models/event.js');
const bookshelf = require('../db/models/db.js');

// TODO: Remove all Tags stuff
const Tag = require('../db/models/tag.js');

// TODO: Move all database access to helper methods

// TODO: Import helper methods


// No User Context needed
// GET all groups (no id or group_id needed)
	// should contain name of the group and creator profile
	// should contain a list of members
	// should contain a list of requests from guests to join the group
	// should contain a list of invitations from members to join to the group
// POST, create a new group with options
	// should check to see if options object contains {name}
	// should check to see if groups already has that name
	// if not already exists, then continue...
  // should check if current user is in a group
  // should only let the user create a group if the user is not in a group
	// should current user to creator
	// should set the name of the group with options
	// should return the id and details of the event to the client
router.route('/groups')
	.get((req, res) => {
		let id = 1,
		data = {}
		User.where({id:id}).fetch({withRelated: ['groupsBelongingTo','groupsCreated']})
		.then((groups) => {
			if(groups) {
				data.groupsBelongingTo = groups.related('groupsBelongingTo')
				data.groupsCreated = groups.related('groupsCreated')
				res.status(200).json(data);
			} else {
				res.status(200).send('Looks like you don\'t have any active groups')
			}
		})
		.catch((err) => {
			res.send(err)
		})
	})
	.post((req, res) => {
		// { creator_id, name}
		let creatorId = 1
		let groupData = {creator_id: creatorId}
		
		Object.assign(groupData, req.body)

		new Group(groupData).save()
		.then((group) => {
			if(group) {
				res.status(200).send('Group saved:' + group.get('name'))
			} else {
				res.status(400).send('Could not save group')
			}
		})
		.catch((err) => {
			res.status(400).send('Could not save this group')
		})
	})


// Require User to be authenticated

// GET the group's detail (no id needed, but require group_id in query params)
	// should contain name of the group and creator profile
	// should contain a list of members
	// should contain a list of requests from guests to join the group
	// should contain a list of invitations from members to join to the group
router.route('/groups/:id')
	.get((req,res) => {
		
		let groupId = req.params.id

		Group.where({id:groupId}).fetch({withRelated: ['members', 'events']})
		.then((group) => {
			res.status(200).json(group)
		})
	})


// GET the current user's group detail
	// should contain name of the group and creator profile
	// should contain a list of members
	// should contain a list of requests from guests to join the group
	// should contain a list of invitations from members to join to the group
// DELETE, remove the user from the current group (user has left the group)
	// should check to see if the user is a member of the group or its creator
	// should remove the user from the user / group join table
// Possible areas for sending text messages and notifications via the util helpers
router.route('/group')
	.get((req,res) => {
		res.send({result: 'Still working on this endpoint!'});
	})
	.delete((req,res) => {
		res.send({result: 'Still working on this endpoint!'});
	})

// POST, send an invitation to another user to join current user's group
	// should check if body object contains { phonenumber or (user) id }
	// should check to see if the current user is in a group
	// should check to see if the params object can identify a user profile with phonenumber or id
	// if not able to identify with phone number, then create a new user with the phonenumber
	// After retrieving guest User id and details,
	// should check to see if guest is already in a group
	// if not in a group, then set status in user / group to 'invited'
// Possible areas for sending text messages and notifications via the util helpers
router.route('/group/send/invite')
	.post((req,res) => {
		res.send({result: 'Still working on this endpoint!'});
	})

// POST, send a request from the current user to a group to join the group
  // should check to see if body object contains { name }
  // should check to see if the group with that name exists
  // get the group id and details
	// should check to see if current user is currently in a group
	// if current user is not in a group, then continue...
	// should create or update status in user / group to 'requested'
	// should send notification to all users in that group
// Possible areas for sending text messages and notifications via the util helpers
router.route('/group/send/request')
	.post((req,res) => {
		res.send({result: 'Still working on this endpoint!'});
	})

// POST, current user accept a group's invitation
	// should check to see if body object contains { group_id }
	// should check to see if the group exists
	// get group id and details
	// should check to see if current user is in a group
	// if not in a group, then continue...
	// should check current user's user / group
	// if status is 'invited', then continue...
	// should set status in user / group to 'member'
	// should send notification to the user and members of the group
// DELETE, current user reject a group's invitation
	// should check to see if body object contains { group_id }
	// should check to see if the group exists
	// get group id and details
	// should check to see if current user is in a group
	// if not in a group, then continue...
	// should check current user's user / group
	// if status is 'invited', then continue...
	// should delete user / group entry for current user
// Possible areas for sending text messages and notifications via the util helpers
router.route('/group/invitations')
	.post((req,res) => {
		res.send({result: 'Still working on this endpoint!'});
	})
	.delete((req,res) => {
		res.send({result: 'Still working on this endpoint!'});
	})

// POST, current user's group accept a guest user's request to join the group
	// should check to see if body object contains { user_id }
	// should check to see if the user exists
	// get guest user id and details
	// should check to see if current user is in a group
	// get current user's group id and details
	// should check guest user's user / group
	// if status is 'requested', then continue...
	// should set status in user / group to 'member'
	// should send notification to the user and members of the group
// DELETE, current user's group reject a guest user's request to join the group
	// should check to see if body object contains { user_id }
	// should check to see if the user exists
	// get guest user id and details
	// should check to see if current user is in a group
	// get current user's group id and details
	// should check guest user's user / group
	// if status is 'requested', then continue...
	// should delete user / group entry for guest user
// Possible areas for sending text messages and notifications via the util helpers
router.route('/group/requests')
	.post((req,res) => {
		res.send({result: 'Still working on this endpoint!'});
	})
	.delete((req,res) => {
		res.send({result: 'Still working on this endpoint!'});
	})



// TODO: Remove endpoints (refactored to /group)

// TODO: Remove this endpoint (refactored to /group)
router.post('/groups/:id/invite',(req,res) => {
	let Members = bookshelf.Collection.extend({model: User}),
	groupId = req.params.id,

	incomingMembers = req.body.invitedMembers
	//make incoming Member list into a collection
	incomingMemberColl = Members.forge(incomingMembers)
	//Save models in collection into database. Will only save unique models. If duplicates, will return error
	incomingMemberColl.invokeThen('save')
	.catch((err) => {
		console.log(err)
	})

	//fetch Users' models from db
	Promise.all(incomingMembers.map((member) => {
		return User.where({phone_validated:member.phone_validated}).fetch()
	}))
	.then((newMembers) => {
		Group.where({id:groupId}).manageMembers(newMembers, 'invited')
		.then((result) => {
			res.status(200).send(result)
		})
		.catch((err) => {
			res.status(400).send('Something went wrong')
		})
	})
});

// TODO: Remove this endpoint (refactored to /group)
router.post('/groups/:id/acceptInvite', (req,res) => {
	let groupId = req.params.id

	//check group to see if member is invited
	Group.where({id:groupId}).getInfo()
	.then((group) => {
		return group.related('members')
		.updatePivot({status:'member'},{query: {where: {user_id: userId}}})
	})
	.then((result) => {
		res.status(200).send(result)
	})
	.catch((err) => {
		res.status(400).send(err)
	})
})

// TODO: Remove this endpoint (refactored to /group)
router.post('/groups/:id/request',(req,res) => {
	let Members = bookshelf.Collection.extend({model: User}),
	groupId = req.params.id,
	userId = 1

	Group.where({id:eventId}).getInfo()
	.then((group) => {
		return group.related('members')
		.updatePivot({status:'requested'},{query: {where: {user_id: userId}}})
	})
	.then((result)=> {
		res.status(200).send('You\'ve requested to be a part of the group')
	})
	.catch((err) => {
		res.status(400).send('Something went wrong, please try again')
	})
});


module.exports = router