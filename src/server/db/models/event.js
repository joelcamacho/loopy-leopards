const bookshelf = require('./db.js');

const User = require('./user.js');
const Group = require('./group.js');
const Tag = require('./tag.js');

const Event = bookshelf.Model.extend({
	tableName: 'events',

	hasTimestamps: ['created_at', 'updated_at'],

	invitees: function() {
		return this.belongsToMany('User').withPivot('voted')
		// .withPivot(user_id)
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

	addInvitees: function(invitees) {

		return this.getInfo()
		.then((event) => {
			return event.related('invitees').attach(invitees)
		})
	},

	vote: function(userId, vote) {
		return this.getInfo()
		.then((event) => {
			return event.related('invitees').updatePivot({voted:vote},{query: {where: {user_id: userId}}})
		})
	}
})

module.exports = bookshelf.model('Event', Event);