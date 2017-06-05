const bookshelf = require('./db.js');

const User = require('./user.js');
const Group = require('./group.js');
const Tag = require('./tag.js');

const Event = bookshelf.Model.extend({
	tableName: 'events',

	hasTimestamps: ['created_at', 'updated_at'],

	invitees: function() {
		return this.belongsToMany('User').withPivot('voted').withPivot('status');
	},

	group: function() {
		return this.belongsTo('Group');
	},

	tags: function() {
		return this.belongsToMany('Tag');
	},

	getInfo: function() {
		return this.fetch({withRelated: ['invitees']})
	},

	vote: function(userId, vote) {
		return this.getInfo()
		.then((event) => {
			return event.related('invitees').updatePivot({voted:vote},{query: {where: {user_id: userId}}})
		})
	},

	attachInvitees: function(invitees, status) {

		return this.getInfo()
		.then((event) => {
			if(event) {
				return event.related('invitees').attach(invitees)
			} else {
				throw new Error('That event doesn\'t exist')
			}
		})
		.then((invitees) => {
			if (invitees) {
				return invitees.updatePivot({status: status})
			} else {
				throw new Error('Could not add invitee to event')
			}
		})
		.catch((err) => {
			throw new Error('Something went wrong, please try again')
		})
	},

	removeInvitees: function(invitees) {

		return this.getInfo()
		.then((event) => {
			if(event) {
				return event.related('invitees').detach(invitees)
			} else {
				throw new Error('That event doesn\'t exist')
			}
		})
		.catch((err) => {
			throw new Error('Something went wrong, please try again')
		})
	},

	userInvitedORRequested: function(invitee) {
		return this.getInfo()
		.then((event) => {
			return event.related('invitees').get(invitee);
		})
		.catch((err) => {
			throw new Error(err);
		})
	},

	acceptRequestORInvitation: function(invitees) {
		return this.related('invitees').updatePivot({status:'confirmed'}, {query: {where: {user_id: invitees}}})
	}
})

module.exports = bookshelf.model('Event', Event);