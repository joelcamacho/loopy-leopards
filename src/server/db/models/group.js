let bookshelf = require('./bookshelf.js');

let Activity = require('./activity.js');
let User = require('./user.js');
let Tag = require('./tag.js');

let Group = bookshelf.Model.extend({
	tablename: 'groups',

	users: () => {
		return this.belongsToMany(User);
	},

	activities: () => {
		return this.belongsToMany(Activity);
	},

	tags: () => {
		return this.belongsToMany(Tag);
	}
})