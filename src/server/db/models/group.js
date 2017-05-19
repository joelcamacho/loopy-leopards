let bookshelf = require('./bookshelf.js');

let Activity = require('./activity.js') 
let User = require('./user.js');
let Tag = require('./tag.js')

let Group = bookshelf.Model.extend({
	tablename: 'groups',

	users: () => {
		return this.hasMany(User)
	},

	activities: () => {
		return this.hasMany(Activity)
	}
})