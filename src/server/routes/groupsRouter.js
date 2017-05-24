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

module.exports = router