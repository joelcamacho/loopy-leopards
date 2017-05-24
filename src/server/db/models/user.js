const bookshelf = require('./db.js');
const _ = require('underscore');

const Event = require('./event.js');
const Group = require('./group.js');
const Tag = require('./tag.js');

const User = bookshelf.Model.extend({
  tableName: 'users',

  initialize: function() {
    this.on("creating", (model, attrs, options) => {
      if(attrs.google_id === null) {
        this.set({'registered': false})
      } else {
        this.set({'registered' : true});
      };

      this.set({'phone_validated' : false});
    });
    this.on("saving", (model, attrs, options) => {
      // if(this.hasChanged('email')) {
      //   return this
      //   .query({where: {email: this.get('email')}})
      //   .fetch(_.pick(options, 'transacting'))
      //   .then(function(exists) {
      //     // if (!exists) throw new Error('email already exists in system');
      //   })
      // }
      // if(this.hasChanged('phone')) {
      //   return this
      //   .query({where: {email: this.get('phone')}})
      //   .fetch(_.pick(options, 'transacting'))
      //   .then(function(exists) {
      //     if (!exists) throw new Error('phone number already exists in system');
      //   })
      // }
    })
  },

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
