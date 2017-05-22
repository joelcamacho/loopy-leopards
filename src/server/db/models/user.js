const bookshelf = require('./db.js');

const Event = require('./event.js');
const Group = require('./group.js');
const Tag = require('./tag.js');

const User = bookshelf.Model.extend({
  tableName: 'users',

  groups: function() {
  	return this.belongsToMany('Group');
  },

  invitedTo: function() {
  	return this.belongsToMany(Event);
  },

  created: function() {
    return this.belongsToMany(Event).query({where: {creator_id: this.get('id')}});
  },

  tags: function() {
  	return this.belongsToMany('Tag');
  },

  byPhone: function(phone) {
    return this.forge().query({where:{phone:phone}}).fetch();
  }
});

module.exports = bookshelf.model('User', User);
