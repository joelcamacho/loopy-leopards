let bookshelf = require('./bookshelf.js');

let User = require('./user.js');
let Group = require('./group.js');
let Tag = require('./tag.js');

let Activity = bookshelf.Model.extend({
	tablename: 'activities',

	users: () => {
		return this.belongsToMany(User);
	},

	groups: () => {
		return this.belongsToMany(Group);
	},

	tags: () => {
		return this.belongsToMany(Tag);
	}
})

module.exports = Bookshelf.model('Activity', Activity);