let bookshelf = require('./bookshelf.js');

let Activity = require('./activity.js');
let User = require('./user.js');
let Group = require('./group.js');

let Tag = bookshelf.Model.extend({
	tablename: 'tags',

	users: () => {
		return this.belongsToMany(User);
	},

	activities: () => {
		return this.belongsToMany(Activity);
	},

	groups: () => {
		return this.belongsToMany(Group);
	},

	
})