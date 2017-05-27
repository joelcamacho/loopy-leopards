const bookshelf = require('./db.js');
const Event = require('./event.js');
const Group = require('./group.js');
const Tag = require('./tag.js');

const User = bookshelf.Model.extend({
  tableName: 'users',

  initialize: function() {
    this.on("saving", (model, attrs, options) => {
      if(attrs.google_id === null) {
        this.set({'registered': false}).save()
      } else {
        this.set({'registered' : true}).save()
      };
    })

    //   this.set({'phone_validated' : false});
    // });
    this.on("updating", (model, attrs, options) => {
      if(this.hasChanged('email')) {
        return this
        .query({where: {email: this.get('email')}}).fetch()
        .then(function(exists) {
          if (!exists) throw new Error('email already exists in system');
        })
      }
      if(this.hasChanged('phone')) {
        return this
        .query({where: {email: this.get('phone')}}).fetch()
        .then(function(exists) {
          if (!exists) throw new Error('phone number already exists in system');
        })
      }
    })
  },

  groupsBelongingTo: function() {
  	return this.belongsToMany('Group');
  },

  groupsCreated: function() {
    return this.belongsToMany('Group').query({where: {creator_id: this.get('id')}});
  },

  eventsInvitedTo: function() {
  	return this.belongsToMany('Event');
  },

  eventsCreated: function() {
    return this.belongsToMany('Event').query({where: {creator_id: this.get('id')}});
  },

  tags: function() {
  	return this.belongsToMany('Tag');
  },

  getEvents: function() {
    return this.fetch({withRelated: ['eventsInvitedTo', 'eventsCreated']})
    .then((results) => {
      return {invitedTo: results.related('eventsInvitedTo'), created: results.related('eventsCreated')}
    })
  }
});

module.exports = bookshelf.model('User', User);
