const router = require('express').Router();

// TODO: Remove all database access
const Group = require('../db/models/group.js');
const User = require('../db/models/user.js');
const Event = require('../db/models/event.js');
const bookshelf = require('../db/models/db.js');

// TODO: Remove all Tags stuff
const Tag = require('../db/models/tag.js');

// TODO: Import helper methods
const helpers = require('../helpers/db.helpers.js')

// No User Context needed
// GET all groups (no id or group_id needed)
	// should contain name of the group and creator profile
	// should contain a list of members
	// should contain a list of requests from guests to join the group
	// should contain a list of invitations from members to join to the group
router.route('/groups')
	.get((req, res) => {
// ***************** WORKING *******************
		helpers.getAllGroupsInfo()
		.then(groups => res.json(groups))
		.catch(err => res.status(400).send({result: err}))
	})
	
// POST, create a new group with options
	.post((req, res) => {
// ***************** WORKING *******************
		let options = req.body;
		let groupName = req.body.name || null;
		let google_id = req.user ? req.user.id : '105464304823044640566';
		let user_id = null;

		helpers.getUserIdFromGoogleId(google_id)
		.then(id => {
			user_id = id;
			return User.where({id:id}).groupsBelongingTo()
		})
		.then(groups => {
			if(groups.serialize().length > 0) {
				res.send({result: 'To create a new group, please leave your current group'})
			} else {
				// should check to see if options object contains {name}
				if(groupName) {
					// should check to see if groups already has that name
					helpers.getAllGroupsInfo()
					.then(groups => {						
						let exists = groups.find(group => group.name === groupName);

						if(!!exists) {
							res.send({ result: 'Sorry, that group name already exists'});
						} else {
							// should only let the user create a group if the user is not in a group
							// should current user to creator
							// should set the name of the group with options
							// should return the id and details of the event to the client
							return helpers.createNewGroup(user_id, options)
						}
					})
					.catch(err => res.send({result: err}))
					.then(result => res.send({result: result}))
				}
			}
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
// ***************** WORKING *******************		
		let groupId = req.params.id

		Group.where({id:groupId}).getInfo()
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
// ***************** WORKING *******************
		let google_id = req.user ? req.user.id : '105464304823044640566';
		let user_id = null;

		helpers.getUserIdFromGoogleId(google_id)
		.then(id => {
			user_id = id;
			return helpers.getCurrentUserGroup(user_id)
		})
		.then(result => {
			res.send(result)
		})
		.catch(err => res.send(err))
	})
	.delete((req,res) => {
// ***************** WORKING *******************
		let google_id = req.user ? req.user.id : '105464304823044640566';
		let user_id = null;

		helpers.getUserIdFromGoogleId(google_id)
		.then(id => {
			user_id = id;
			return helpers.getCurrentUserGroup(user_id);
		})
		.then(group => {
			return helpers.leaveGroup(user_id, group.groupsBelongingTo.serialize()[0].id)
		})
		.then(result => res.json(result))
		.catch(err => res.send(err))
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
		let phone = req.body.phone;
		let google_id = req.user ? req.user.id : null;
		let user_id = null;
		let group_id = null;

		if(!phone) return res.send('Must include a phone number')
		if(!google_id) return res.send('Must be authenticated');

		helpers.getUserIdFromGoogleId(google_id)
		.then(id => {
			user_id = id;
			return helpers.getCurrentUserGroup(id)
		})
		.catch(err => res.send('Current user is not in a group!'))
		.then(group => {
			group_id = group.id;
			return User.where({phone: phone}).fetch();
		})
		.then(user => {
			if(user) {
				// if guest user exists
				return user;
			} else {
				// if guest user is not in db
				return helpers.createNewUser({
					name: "Anonymous",
					phone: phone
				});
			}
		})
		.then(user => {
			return helpers.sendInvitationToJoinGroup(user.id, group_id);
		})
		.catch(err => res.send(err))
		.then(result => res.send(result));
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

		let name = req.body.name;
		let google_id = req.user ? req.user.id : null;
		let user_id = null;
		let group_id = null;

		if(!name) return res.send('Must include a name')
		if(!google_id) return res.send('Must be authenticated');

		helpers.getUserIdFromGoogleId(google_id)
		.then(id => {
			user_id = id;
			return Group.where({name: name}).fetch()
		})
		.then(group => {
			if(!group) res.send('This group doesn\'t exist');
			else {
				return helpers.sendRequestToJoinGroup(user_id, group.id);
			}
		})
		.catch(err => res.send(err))
		.then(result => res.send(result));
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
	.get((req,res) => {
		// Should return {result: [group]}
		let data = {},
		google_id = req.user ? req.user.id : null;

		helpers.getUserIdFromGoogleId(google_id)
		.then(id => {
			return User.where({id:id}).groupsBelongingTo()
		})
		.then(groups => {
			let result = groups.map(group => group.serialize());
			result = result.filter(group => group.status === 'invited');
			res.send(result);
		})
	})
	.post((req,res) => {
		let google_id = req.user ? req.user.id : null;
		let group_id = req.body.group_id;
		let user_id = null;

		if(!google_id) return res.send('User must be authenticated');
		if(!group_id) return res.send('Body must contain group_id field');

		helpers.getUserIdFromGoogleId(google_id)
		.then(id => {
			user_id = id;
			return User.where({id: user_id}).groupsBelongingTo();
		})
		.then(groups => {
			let exist = groups.find(group => group.id === group_id);

			if(!exist) {
				return res.send('Invalid group_id');
			} else {
				if(exist.status === 'invited') {
					return helpers.joinGroup(user_id, exist.id);
				} else {
					res.send('User has not been invited to group')
				}
			}
		})
		.catch(err => res.send(err))
		.then(result => res.send(result));
	})
	.delete((req,res) => {

		let google_id = req.user ? req.user.id : null;
		let group_id = req.body.group_id;
		let user_id = null;

		if(!google_id) return res.send('User must be authenticated');
		if(!group_id) return res.send('Body must contain group_id field');

		helpers.getUserIdFromGoogleId(google_id)
		.then(id => {
			user_id = id;
			return User.where({id: user_id}).groupsBelongingTo();
		})
		.then(groups => {
			let exist = groups.find(group => group.id === group_id);

			if(!exist) {
				return res.send('Invalid group_id');
			} else {
				if(exist.status === 'invited') {
					return helpers.rejectInvitationToJoinGroup(user_id, exist.id);
				} else {
					res.send('User has not been invited to group')
				}
			}
		})
		.catch(err => res.send(err))
		.then(result => res.send(result))
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
		
		let group_id = req.body.group_id,
		guest_id = req.body.guest_id

		User.where({id:guest_id}).groupsBelongingTo()
		.then(groups => {
			if(groups) {
				res.send('Must leave current group to request an invitation to another', group)
			} else {
				groups = groups.map(group => group.serialize())
				let isMember = groups.find(group => group.status === 'member')

				if(isMember) {
					res.send('You are already in a group.')
				} else {
					let exist = groups.find(group => group.id === group_id);

					if(!exist) {
						return res.send('Invalid group_id');
					} else {
						if(exist.status === 'requested') {
							return helpers.acceptRequestToJoinGroup(user_id, exist.id);
						} else {
							res.send('User has not requested to join group')
						}
					}
				}
			}
		})
		.then(result => res.send(result))
		.catch(err => res.send(err));
	})
	.delete((req,res) => {
		let group_id = req.body.group_id,
		guest_id = req.body.guest_id

		User.where({id:guest_id}).groupsBelongingTo()
		.then(groups => {
			if(groups) {
				res.send('Must leave current group to request an invitation to another', group)
			} else {
				groups = groups.map(group => group.serialize())
				let isMember = groups.find(group => group.status === 'member')

				if(isMember) {
					res.send('You are already in a group.')
				} else {
					let exist = groups.find(group => group.id === group_id);

					if(!exist) {
						return res.send('Invalid group_id');
					} else {
						if(exist.status === 'requested') {
							return helpers.rejectRequestToJoinGroup(user_id, exist.id);
						} else {
							res.send('User has not requested to join group')
						}
					}
				}
			}
		})
		.then(result => res.send(result))
		.catch(err => res.send(err));
	})

module.exports = router