const router = require('express').Router();
const Group = require('../db/models/group.js');
const User = require('../db/models/user.js');
const Event = require('../db/models/event.js');
const Tag = require('../db/models/tag.js');
const bookshelf = require('../db/models/db.js');

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

		new Group(groupData).save(null, null, null, {require:true})
		.then((group) => {
			if(group) {
				group.related('members').attach(creatorId)
				res.status(200).send('Group saved:' + group.get('name'))
			} else {
				res.status(400).send('Could not save group')
			}
		})
		.catch((err) => {
			res.status(400).send('Could not save this group')
		})
	})

router.route('/groups/:id')
	.get((req,res) => {
		
		let groupId = req.params.id

		Group.where({id:groupId}).getInfo()
		.then((group) => {
			res.status(200).json(group)
		})
	})

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
		Group.where({id:groupId}).attachMembers(newMembers, 'invited')
		.then((result) => {
			res.status(200).send(result)
		})
		.catch((err) => {
			res.status(400).send('Something went wrong')
		})
	})
});

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