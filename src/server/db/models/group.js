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

	getInfo: function() {
		return this.fetch({withRelated: 'members'})
	},

	manageMembers: function(newMembers, status) {

		return this.getInfo()
		.then((group) => {
			return group.related('members').attach(newMembers)
		})
		.then((members) => {
			return members.updatePivot({status: status})
		})
	}
})

module.exports = bookshelf.model('Group', Group);