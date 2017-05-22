const bookshelf = require('./db.js');

const Event = require('./event.js');
const User = require('./user.js');
const Group = require('./group.js');

const Tag = bookshelf.Model.extend({
	tableName: 'tags',

	users: function() {
		return this.belongsToMany(User);
	},

	events: function() {
		return this.belongsToMany(Event);
	},

	groups: function() {
		return this.belongsToMany(Group);
	},
})

module.exports = bookshelf.model('Tag', Tag);