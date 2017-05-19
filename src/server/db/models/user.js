let bookshelf = require('./bookshelf.js');

let Activity = require('./activity.js');
let Group = require('./group.js');
let Tag = require('./tag.js');

let User = bookshelf.Model.extend({
  tablename: 'users',

  groups: () => {
  	return this.belongsToMany(Group)
  },

  activities: () => {
  	return this.hasMany(Activity)
  },
});