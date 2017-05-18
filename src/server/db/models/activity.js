let bookshelf = require('./bookshelf.js');

let User = require('./user.js');
let Group = require('./group.js');
let Tag = require('./tag.js')

let Activity = bookshelf.Model.extend({
	tablename: 'activities',

	users: () => {
		return this.hasMany(User)
	},

	groups: () => {
		return this.belongsToMany(Group)
	},

	tags: () => {
		return this.hasMany(Tag)
	}
})