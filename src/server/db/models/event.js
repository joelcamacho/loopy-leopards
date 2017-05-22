const bookshelf = require('./db.js');

const User = require('./user.js');
const Group = require('./group.js');
const Tag = require('./tag.js');

const Event = bookshelf.Model.extend({
	tableName: 'events',

	hasTimestamps: ['created_at', 'updated_at'],

	invitees: function() {
		return this.belongsToMany('User');
	},

	groups: function() {
		return this.belongsTo('Group');
	},

	tags: function() {
		return this.belongsToMany('Tag');
	},

	// createOrUpdate: function(data, options) {
	// 	return this.forge(data).save(null, options)
	// }
})

module.exports = bookshelf.model('Event', Event);