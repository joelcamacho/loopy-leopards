const router = require('express').Router();

const Group = require('../db/models/group.js');
const User = require('../db/models/user.js')
const Event = require('../db/models/event.js');
const Tag = require('../db/models/tag.js')

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
		}
	})
	.catch((err) => {
		res.send(err)
	})
})

.post((req, res) => {

	let creatorId = 1
	let groupData = {creator_id: creatorId}
	
	for(var key in req.body) {
		groupData[key] = req.body[key];
	}

	new Group(groupData).save()
	.then((event) => {
		res.status(200).send('Event saved!')
	})
	.catch((err) => {
		res.status(400).send('Could not save this event')
	})
})


router.route('/groups/:id')

.get((req,res) => {
	
	let groupId = req.params.id,
	data = {}

	Group.where({id:groupId}).fetch({withRelated: ['members', 'events']})
	.then((group) => {
		data.group = group
		res.status(200).json(data)
	})
})

router.post('/groups/:id/invite',(req,res) => {

	let Members = bookshelf.Collection.extend({model: User});
	let groupId = req.params.id,
	// responseData = {alreadyInvited:[]},
	incomingMembers = [{first_name: 'Joel', phone: '11111111'},{first_name: 'jon', phone: '6534734'}],


	//make incoming Member list into a collection
	incomingMemberColl = Members.forge(incomingMembers)
	//Save models in collection into database. This will only save models that aren't duplicates
	incomingMemberColl.invokeThen('save')
	.catch((err) => {
		console.log(err)
	})

	//fetch any Members' models from db
	Promise.all(incomingMembers.map((member) => {
		return User.where({phone:member.phone}).fetch()
	}))
	.then((newMembers) => {
		Group.where({id: groupId}).addMembers(newMembers)
		.then((result) => {
			res.status(200).send(result)
		})
		.catch((err) => {
			res.status(400).send('Something went wrong with your invitations')
		})
	})
});


module.exports = router