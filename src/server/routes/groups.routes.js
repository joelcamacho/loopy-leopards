const router = require('express').Router();
const helpers = require('../helpers/db.helpers.js')
const util = require('../helpers/util.helpers.js');

// group specific helpers 
const findMember = (groups) => {
	return groups.find(group => group._pivot_status === 'member');
}

// No User Context needed
// GET all groups (no id or group_id needed)
	// should contain name of the group and creator profile
	// should contain a list of members
	// should contain a list of requests from guests to join the group
	// should contain a list of invitations from members to join to the group
// POST, create a new group with options
	// should check to see if options object contains {name}
	// should check to see if groups already has that name
	// should only let the user create a group if the user is not in a group
	// should current user to creator
	// should set the name of the group with options
	// should return the id and details of the event to the client
router.route('/groups')
	.get((req, res) => {
		helpers.getAllGroupsInfo()
		.then(groups => res.json(groups))
		.catch(err => res.status(400).send({result: err}))
	})
	.post((req, res) => {
		let options = req.body;
		let groupName = req.body.name || null;
		let google_id = req.user ? req.user.id : null;
		let user_id = null;
		let failed = false;

		helpers.getUserIdFromGoogleId(google_id)
		.then(id => {
			user_id = id;
			return helpers.getCurrentUserGroup(user_id);
		})
		.then(result => {
			let groups = result.groupsBelongingTo.serialize();
			let isMember = findMember(groups);

			if(!!isMember) {
				failed = true;
				res.send({result: 'To create a new group, please leave your current group'})
			} else {
				if(groupName) {
					helpers.getAllGroupsInfo()
					.then(groups => {						
						let exists = groups.find(group => group.name === groupName);

						if(!!exists) {
							failed = true;
							res.send({ result: 'Sorry, that group name already exists'});
						} else {
							return helpers.createNewGroup(user_id, options)
						}
					})
					.catch(err => res.send({result: err}))
					.then(result => {
						// SEND NOTIFICATION TO MEMBERS OF THIS GROUP .aka the creator
						if(!failed) {
								util.pushToUserFromId(user_id, {
								body: 'Congratulations on creating a group! You can now invite your friends to your group in the groups page.'
							});
						}

						res.send({result: result});
					})
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
		let group_id = req.params.id
		helpers.getGroup(group_id)
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
		let google_id = req.user ? req.user.id : null;
		let user_id = null;

		if(!google_id) return res.send({result: 'Must be authenticated'});

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
		let google_id = req.user ? req.user.id : null;
		let user_id = null;
		let user_name = null;
		let members = [];
		let group_details = null;

		if(!google_id) return res.send({result: 'Must be authenticated'});

		helpers.getCurrentUserFromGoogleId(google_id)
		.then(user => {
			user_id = user.serialize().id;
			user_name = user.serialize().first_name;
			return helpers.getCurrentUserGroup(user_id);
		})
		.then(group => {
			let details = group.groupsBelongingTo.serialize();

			group_details = findMember(details);

			if(!!group_details) {
				return helpers.leaveGroup(user_id, group_details.id)
			} else {
				res.send({result: 'User is not a member of a group!'});
			}
		})
		.catch(err => res.send(err))
		.then(result => {
			return helpers.getGroup(group_details.id);
		})
		.catch(err => res.send(err))
		.then(result => {
			let message = user_name +' has left ' + result.serialize().name + '...';

			// SEND NOTIFICATION TO MEMBERS OF THIS GROUP
			util.pushToUsers(result.serialize().members, {
				body: message
			});

			res.send({result: 'You have left the group!'});
		})
	})

// GET all group invitations for the current user
// POST, send an invitation to another user to join current user's group
	// should check if body object contains { phonenumber or (user) id }
	// should check to see if the current user is in a group
	// should check to see if the params object can identify a user profile with phonenumber or id
	// if not able to identify with phone number, then create a new user with the phonenumber
	// After retrieving guest User id and details,
	// should check to see if guest is already in a group
	// if not in a group, then set status in user / group to 'invited'
// PUT, current user accept a group's invitation
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
		let data = {},
		google_id = req.user ? req.user.id : null;
		
		if(!google_id) return res.send({result: 'Must be authenticated'});

		helpers.getUserIdFromGoogleId(google_id)
		.then(id => {
			return helpers.getCurrentUserGroup(id)
		})
		.then(groups => {
			let result = groups.groupsBelongingTo;
			result = result.map(group => group.serialize());
			result = result.filter(group => group._pivot_status === 'invited');
			res.send(result);
		})
	})
	.post((req,res) => {	
		let phone = req.body.phone;
		let google_id = req.user ? req.user.id : null;
		let user_id = null;
		let group_id = null;
		let group_details = null;

		if(!phone) return res.send('Must include a phone number')
		if(!google_id) return res.send('Must be authenticated');

		helpers.getUserIdFromGoogleId(google_id)
		.then(id => {
			user_id = id;
			return helpers.getCurrentUserGroup(user_id)
		})
		.then(group => {
			group_details = findMember(group.groupsBelongingTo.serialize());
			if(!!group_details) {
				group_id = group_details.id;
			} else {
				return res.send('The current user is not in a group');
			}
			
			return helpers.getCurrentUserFromPhone(phone);
		})
		.catch(err => {
			return helpers.createNewUser({
				first_name: "Anonymous",
				phone: phone
			});
		})
		.then(user => user)
		.then(user => {
			// SEND TEXT MESSAGE TO PHONE
			util.sendMessageToPhone(phone, 'You have been invited to join ' + group_details.name + ' on Hanginhubs. Please log in to join the group and start hanging out!');

			return helpers.sendInvitationToJoinGroup(user.serialize().id, group_id);
		})
		.catch(err => res.send(err))
		.then(result => res.send(result));
	})
	.put((req,res) => {
		let google_id = req.user ? req.user.id : null;
		let group_id = req.body.group_id;
		let user_id = null;
		let user_name = null;
		let members = [];
		let group_details = null;
		let failed = false;

		if(!google_id) return res.send('User must be authenticated');
		if(!group_id) return res.send('Body must contain group_id field');

		helpers.getCurrentUserFromGoogleId(google_id)
		.then(user => {
			user_id = user.serialize().id;
			user_name = user.serialize().first_name;
			return helpers.getCurrentUserGroup(user_id)
		})
		.then(groups => {
			let result = groups.groupsBelongingTo.serialize();
			invitees = result.filter(group => group._pivot_status === 'invited');

			let exist = invitees.find(group => group.id == group_id);

			if(!exist) {
				failed = true;
				return res.send('Invalid group_id');
			} else {
				return helpers.joinGroup(user_id, exist.id);
			}
		})
		.catch(err => {
			failed = true;
			res.send(err);
		})
		.then(result => {
			return helpers.getGroup(group_id);
		})
		.then(result => {
			if(!failed) {
				let message = user_name +' has joined ' + result.serialize().name + '!';

				// SEND NOTIFICATION TO MEMBERS OF THIS GROUP
				util.pushToUsers(result.serialize().members, {
					body: message
				});
			
				res.send({result: 'You have joined the group!'});
			}
		})
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
			return helpers.getCurrentUserGroup(user_id)
		})
		.then(groups => {
			let result = groups.groupsBelongingTo;
			result = result.map(group => group.serialize());
			result = result.filter(group => group._pivot_status === 'invited');

			let exist = result.find(group => group.id === group_id);

			if(!exist) {
				return res.send('Invalid group_id');
			} else {
				return helpers.rejectInvitationToJoinGroup(user_id, exist.id);
			}
		})
		.catch(err => res.send(err))
		.then(result => res.send(result));
	})

// GET all current user's group's requests from guests to join the group
// POST, send a request from the current user to a group to join the group
  // should check to see if body object contains { name }
  // should check to see if the group with that name exists
  // get the group id and details
	// should check to see if current user is currently in a group
	// if current user is not in a group, then continue...
	// should create or update status in user / group to 'requested'
	// should send notification to all users in that group
// PUT, current user's group accept a guest user's request to join the group
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
	.get((req,res) => {
		let data = {};
		let google_id = req.user ? req.user.id : null;
		let user_id;

		helpers.getUserIdFromGoogleId(google_id)
		.then(id => {
			user_id = id;
			return helpers.getCurrentUserGroup(user_id)
		})
		.then(groups => {
			let isMember = findMember(groups.groupsBelongingTo.serialize());

			if(!!isMember) {
				group_id = isMember.id;
				return helpers.group_id(group_id);
			} else {
				res.send({result: 'You are not in a group!'});
			}
		})
		.then(group => {
			let result = group.serialize().members;
			result = result.filter(user => user._pivot_status === 'requested');
			res.send(result);
		})
	})	
	.post((req,res) => {
		let name = req.body.name;
		let google_id = req.user ? req.user.id : null;
		let user_id = null;
		let user_name = null;
		let group_id = null;
		let group_details = {};
		let failed = false;

		if(!name) return res.send('Must include a name')
		if(!google_id) return res.send('Must be authenticated');

		helpers.getCurrentUserFromGoogleId(google_id)
		.then(user => {
			user_id = user.serialize().id;
			user_name = user.serialize().first_name;
			return helpers.getGroupByName(name);
		})
		.then(group => {			
			if(!group) {
				failed = true;
				res.send('This group doesn\'t exist')
			} else {
				group_details = group.serialize();
				return helpers.sendRequestToJoinGroup(user_id, group_details.id);
			}
		})
		.catch(err => {
			failed = true;
			res.send(err)
		})
		.then(result => {

			if(!failed) {
				let message = user_name +' has requested to join your group!';

				// SEND NOTIFICATION TO MEMBERS OF THIS GROUP
				util.pushToUsers(group_details.members, {
					body: message
				});
			}
			
			res.send(result);
		});
	})
	.put((req,res) => {
		let google_id = req.user ? req.user.id : null;
		let user_id = null;
		let user_name = null;
		let group_id = null;
		let guest_id = req.body.guest_id;
		let failed = false;

		helpers.getCurrentUserFromGoogleId(google_id)
		.then(user => {
			user_id = user.serialize().id;
			return helpers.getCurrentUserGroup(user_id)
		})
		.then(groups => {
			let isMember = findMember(groups.groupsBelongingTo.serialize());

			if(!!isMember) {
				group_id = isMember.id;
				return helpers.getCurrentUserGroup(guest_id)
			} else {
				failed = true;
				res.send({result: 'You are not in a group!'});
			}
		})
		.then(groups => {
			let result = groups.groupsBelongingTo;
			result = result.map(group => group.serialize());
			result = result.filter(group => group._pivot_status === 'requested');

			let exists = result.find(group => group.id === group_id);

			if(!exists) {
				failed = true;
				res.send('This user wasn\'t invited');
			} else {
				return helpers.joinGroup(guest_id, exists.id);
			}
		})
		.catch(err => res.send(err))
		.then(result => {
			return helpers.getCurrentUserFromId(guest_id);
		})
		.then(result => {
			user_name = result.serialize().first_name;
			return helpers.getGroup(group_id);
		})
		.then(result => {
			if(!failed) {
				let message = user_name +' has joined ' + result.serialize().name + '!';

				// SEND NOTIFICATION TO MEMBERS OF THIS GROUP
				util.pushToUsers(result.serialize().members, {
					body: message
				});
			
				res.send({result: 'You have joined the group!'});
			}
		})
	})
	.delete((req,res) => {
		let google_id = req.user ? req.user.id : null;
		let user_id = null;
		let group_id = null;
		let guest_id = req.body.guest_id;

		helpers.getUserIdFromGoogleId(google_id)
		.then(id => {
			user_id = id;
			return helpers.getCurrentUserGroup(user_id)
		})
		.then(groups => {
			let isMember = findMember(groups.groupsBelongingTo.serialize());

			if(!!isMember) {
				group_id = isMember.id;
				return helpers.getCurrentUserGroup(guest_id)
			} else {
				res.send({result: 'You are not in a group!'});
			}
		})
		.then(groups => {
			let result = groups.groupsBelongingTo;
			result = result.map(group => group.serialize());
			result = result.filter(group => group._pivot_status === 'requested');


			let exists = result.find(group => group.id === group_id);

			if(!exists) {
				res.send('This user wasn\'t invited');
			} else {
				return helpers.rejectInvitationToJoinGroup(guest_id, exists.id);
			}
		})
		.then(result => {
			res.send(result);
		})
		.catch(err => res.send(err));
	})

module.exports = router