const bookshelf = require('./db.js');

const Event = require('./event.js');
const User = require('./user.js');
const Tag = require('./tag.js');

const Group = bookshelf.Model.extend({
	tableName: 'groups',

	members: function() {
		return this.belongsToMany('User').withPivot('status');
	},

	events: function() {
		return this.hasMany('Event');
	},

	tags: function() {
		return this.belongsToMany('Tag');
	},
	//Promise resolving to model or null
	getInfo: function() {
		return this.fetch({withRelated: ['members','events']});
	},

	//Returns Promise
	attachMembers: function(members, status) {

		return this.getInfo()
		.then((group) => {
			if(group) {
				return group.related('members').attach(members)
			} else {
				throw new Error('That group doesn\'t exist')
			}
		})
		.then((members) => {
			if (members) {
				return members.updatePivot({status: status})
			} else {
				throw new Error('Could not add member to group')
			}
		})
		.catch((err) => {
			throw new Error('Something went wrong, please try again')
		})
	},

	removeMembers: function(members) {

		return this.getInfo()
		.then((group) => {

			console.log('got to group', group);

			if(group) {
				return group.related('members').detach(members)
			} else {
				throw new Error('That group doesn\'t exist')
			}
		})
		.catch((err) => {
			console.log(err);
			throw new Error('Something went wrong, please try again')
		})
	},

	memberInvitedORRequested: function(member) {
		return this.getInfo()
		.then((group) => {
			return (!!group && !!group.related('members').get(id))
		})
		.catch((err) => {
			throw new Error('Something went wrong, please try again')
		})
	},

	acceptRequestORInvitation: function(members) {

		return this.memberInvitedORRequested(members)
		.then((result) => {
			if(result) {
				return group.related('members').updatePivot({status:'member'})
			} else {
				throw new Error('Must request membership or be invited to group')
			}
		})
		.catch((err) => {
			throw new Error('Something went wrong, please try again')
		})
	}
})

module.exports = bookshelf.model('Group', Group);