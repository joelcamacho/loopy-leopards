const Promise = require('promise');
const User = require('../db/models/user.js');
const Group = require('../db/models/group.js');
const Event = require('../db/models/event.js');

const userAlreadyInGroup = (id) => {
    return User.where({id:id}).getGroups()
    .then(groups => {
      let members = groups.belongingTo.serialize().filter(user => user._pivot_status === 'member')
      return members.length > 0;
    })
}
// ~~~~~~~~~~~~~~~~~ AUTH ~~~~~~~~~~~~~~~~~ 
// Get Current User's Id from current auth (google_id)
exports.getUserIdFromGoogleId = google_id => {
  return new Promise(function (resolve, reject) {
    if(google_id === undefined) return reject('invalid google_id');
    new User({google_id: google_id}).fetch()
    .then(user => {
      if(!!user) {
        resolve(user.get('id'));
      } else {
        reject('invalid google_id');
      }
    });
  });
};

// ~~~~~~~~~~~~~~~~~ USER ~~~~~~~~~~~~~~~~~ 
// Get all user information
exports.getAllUsers = () => {
  return new Promise(function (resolve, reject) { 
    User.fetchAll()
    .then((users) => {
      resolve(users);
    })
    .catch((err) => {
      reject('Could not retrieve users');
    });
  });
};

// Get Current User's Information from google id
exports.getCurrentUserFromGoogleId = google_id => {
  return new Promise(function (resolve, reject) {
    new User({google_id: google_id}).fetch()
      .then((user) => {
        if(!!user) {
          resolve(user);
        } else {
          reject('invalid id');
        }
      });
  });  
};

// Get Current User's Information from id
exports.getCurrentUserFromId = id => {
  return new Promise(function (resolve, reject) {
    new User({id: id}).fetch()
      .then((user) => {
        if(!!user) {
          resolve(user);
        } else {
          reject('invalid id');
        }
      });
  });  
};

// Get Current User's Information from phone
exports.getCurrentUserFromPhone = phone => {
  return new Promise(function (resolve, reject) {
    new User({phone: phone}).fetch()
      .then((user) => {
        if(!!user) {
          resolve(user);
        } else {
          reject('invalid phone');
        }
      });
  });  
};

// Get Current User's Token From Google Id
exports.getCurrentUserTokenFromGoogleId = google_id => {
  return new Promise(function (resolve, reject) {
    new User({google_id: google_id}).fetch()
      .then((user) => {
        if(!!user) {
          resolve(user.get('token'));
        } else {
          reject('invalid id');
        }
      });
  });  
};

// Get Current User's Token From Id
exports.getCurrentUserTokenFromId = id => {
  return new Promise(function (resolve, reject) {
    new User({id: id}).fetch()
      .then((user) => {
        if(!!user) {
          resolve(user.get('token'));
        } else {
          reject('invalid id');
        }
      });
  });  
};

// Create new User given options obj
exports.createNewUser = options => {
  return new Promise(function (resolve, reject) {
    User.forge(options).save()
    .then((user) => {
      // What is this if statement for?
      // if(user.get('email') === null && user.get('google_id') === null) {
      //   resolve('added ' + user.get('name'));
      // } else {
      //   resolve('Welcome, ' + user.get('first_name'));
      // }
      resolve(user);
    })
    .catch((err) => {
      if(err.code === "ER_DUP_ENTRY") {
        reject('Uh-oh. It looks like that phone number is already in our system!');
      } else {
        reject(err);
      }
    });
  });
};

// Update current User information given options obj
exports.updateCurrentUserFromId = (id, options) => {
  return new Promise(function (resolve, reject) {
    new User({id: id}).save(options, {patch: true})
    .then(user => resolve(user))
    .catch(err => reject(err));
  });
};

// Delete Current User
exports.deleteCurrentUserFromId = (id, options) => {
  return new Promise(function (resolve, reject) {
    new User({id: id}).destroy()
    .then(user => resolve('Sorry to see you go, ' + user.get('name')))
    .catch(err => reject('Could not close account'));
  });
};

// ~~~~~~~~~~~~~~~~~ GROUP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
// Get all group information
exports.getAllGroupsInfo = () => {

  let compiledGroupInfo, ids, groupDetails
  
  return new Promise(function (resolve, reject) {
    Group.fetchAll()
    .then(groups => {
      
    compiledGroupInfo = groups.serialize()

    let ids = compiledGroupInfo.map(group => group.creator_id)
      //TODO: figure out how to optimize, so only fetching profile for UNIQUE users
      // .filter((id,idx,array) => {
      //  return array.indexOf(id) === idx
      // })
      return Promise.all(ids.map(id => {
        return User.where({id:id}).fetch()
      }))
      .then(userProfiles => {
        compiledGroupInfo.forEach((group,idx) => {
          group.creator = userProfiles[idx].serialize()
        })
        return Promise.all(compiledGroupInfo.map(group => {
          return Group.where({id:group.id}).getInfo()
        }))
      })
      .then(groups => {
        compiledGroupInfo.forEach((group, index) => {
          group.all = groups[index].serialize().members
          group.members = [];
          group.requested = [];
          group.invited = [];

          group.all.forEach(profile => {
            if(profile._pivot_status === null || profile._pivot_status === 'member') {
              group.members.push(profile);
            } else if(profile._pivot_status === 'requested') {
              group.requested.push(profile);
            } else if(profile._pivot_status === 'invited'){
              group.invited.push(profile);
            }
          });
          group.events = groups[index].serialize().events
        })
        resolve(compiledGroupInfo)
      })
    })
    .catch((err) => {
      reject('Something went wrong, please try again')
    })
  });
};

// Get Current User's Group Information
exports.getCurrentUserGroup = (id) => {
  return new Promise(function (resolve, reject) {
    User.where({id:id}).getGroups()
    .then((groups) => {
      if(groups) {
        const data = {};
        data.groupsBelongingTo = groups.belongingTo;
        data.groupsCreated = groups.created;
        resolve(data);
      } else {
        reject('Looks like you don\'t have any active groups');
      }
    });
  });
};

// Create a new group and set owner and group options obj
exports.createNewGroup = (id, options) => {
  let group_id = null;
  let group_details = null;

  options.creator_id = id;
  //see if User is already in group
  return new Promise(function (resolve, reject) {
    userAlreadyInGroup(id)
    .then(result => {
      if(result) {
        reject('User is already in a group')
      } else {
        return new Group(options).save()
      }
    })
    .then((group) => {
      if(group) {
        group_id = group.id;
        group_details = group;
        return group.attachMembers(id, 'member');
      } else {
        reject('Could not save group');
      }
    })
    .then((users) => {
      if(users) {
        resolve(group_details);
      } else {
        reject('Could not save user as part of the group');
      }
    });
  });
};

// Get specific group information
exports.getGroup = (group_id) => {
  return new Promise(function (resolve, reject) {
    Group.where({id:group_id}).getInfo()
    .then((group) => {
      if(group) {
        resolve(group);
      } else {
        reject('Could not find group: ' + group_id);
      }
    })
    .catch((err) => {
      reject('Something went wrong, please try again');
    });
  });
};

// Get specific group information
exports.getGroupByName = (name) => {
  return new Promise(function (resolve, reject) {
    Group.where({name:name}).getInfo()
    .then((group) => {
      if(group) {
        resolve(group);
      } else {
        reject('Could not find group: ' + name);
      }
    })
    .catch((err) => {
      reject('Something went wrong, please try again');
    });
  });
};

// Leave current Group
exports.leaveGroup = (id, group_id) => {
  return new Promise(function (resolve, reject) {
    Group.where({id:group_id}).fetch()
    .then(group => {
      return group.removeMembers(id);
    })
    .then(result => {
      resolve(result.serialize());
    })
    .catch(err => {
      console.log('err', err);
    });
  });
};

// Join Group
exports.joinGroup = (id, group_id) => {
  return new Promise(function (resolve, reject) {
    userAlreadyInGroup(id)
    .then(result => {
      if (!result) {
        return Group.where({id: group_id}).getInfo()
      } else {
        reject('Must leave current group to join another')
      }
    })
    .then(group => {
      return group.related('members');
    })
    .then(members => {
      if(members) {
        return members.updatePivot({status: 'member'}, {query: {where: {user_id: id}}} )
      } else {
        throw new Error('Must request membership or be invited to group')
      }
    })
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

// Send Request to join group given group id
exports.sendRequestToJoinGroup = (id, group_id) => {
  return new Promise(function (resolve, reject) {
    userAlreadyInGroup(id)
    .then(result => {
      if(!result) {
        return Group.where({id:group_id}).attachMembers(id,'requested')
      } else {
        reject('Cannot request to join a group if you are currently in a group')
      }
    })
    
    .then((result) => {
      resolve(result)
    })
    .catch((err) => {
      reject('Something went wrong, please try again');
    });
  });
};

// Accept / Reject Invitation to join group given group id
exports.acceptInvitationToJoinGroup = (id, group_id) => {
  return new Promise(function (resolve, reject) {
    Group.where({id:group_id}).acceptRequestOrInvitation(id)
    .then((result) => {
      if(result){
        resolve(result);
      } else {
        reject('Could not accept invitation');
      }
    })
    .catch((err) => {
      reject('Something went wrong, please try again');
    });
  });
};

exports.rejectInvitationToJoinGroup = (id, group_id) => {
  return new Promise(function (resolve, reject) {
    Group.where({id:group_id}).removeMembers(id)
    .then((result) => {
      resolve(result)
    })
    .catch((err) => {
      reject('Something went wrong, please try again');
    });
  });
};

// Invite a user to a group given user id
exports.sendInvitationToJoinGroup = (id, group_id) => {
  return new Promise(function (resolve, reject) {
    userAlreadyInGroup(id)
    .then(result => {
      if(!result) {
        return Group.where({id:group_id}).attachMembers(id,'invited');
      } else {
        reject('Cannot invite a user that is already in another group');
      }
    })
    .then((result) => {
      if(result) {
        resolve(result);
      } else {
        reject('Could not get group', group_id);
      }
    });
  });
};

// Accept / Reject a user's request to join the group given user id
exports.acceptRequestToJoinGroup = (id, group_id) => {
  return new Promise(function (resolve, reject) {
    Group.where({id:group_id}).acceptRequestOrInvitation(id)
    .then((result) => {
      resolve(result)
    })
    .catch((err) => {
      reject('Something went wrong, please try again');
    });
  });
};

exports.rejectRequestToJoinGroup = (id, group_id) => {
  return new Promise(function (resolve, reject) {
    Group.where({id:group_id}).removeMembers(id)
    .then((result) => {
      resolve(result)
    })
    .catch((err) => {
      reject('Something went wrong, please try again');
    });
  });
};

// ~~~~~~~~~~~~~~~~~ EVENT ~~~~~~~~~~~~~~~~~
// Get all events for the user
// 
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Create a new event and set owner and event options obj and group
exports.createNewEvent = (id, group_id, options) => {
  let details = {};
  let members = [];

  Object.assign(options, {
    creator_id: id,
    group_id, group_id
  });

  return new Promise(function (resolve, reject) {
    if(!group_id) {
      new Event(options).save(null, null, null, {require:true})
      .catch((err) => {
        reject('Sorry, could not save your event, please try again!')
      })
      .then((event) => {
        details = event;
        return event.related('invitees').attach(id);
      })
      .catch((err) => {
        reject('Sorry, could not save you as an invitee of this event')
      })
      .then(() => {
        resolve(details);
      })
    } else {
      Group.where({id: group_id}).getInfo()
      .then(group => {
        members = group.serialize().members.map(user => user.id);
        return new Event(options).save(null, null, null, {require:true})
      })
      .catch((err) => {
        reject('Sorry, could not save your event, please try again!')
      })
      .then((event) => {
        details = event;
        return event.related('invitees').attach(members);
      })
      .catch((err) => {
        reject('Sorry, could not save you as an invitee of this event')
      })
      .then(() => {
        resolve(details);
      })
    }
  });
};

exports.getCurrentUserEvents = (id) => {
  let compiledEvents = {invitedTo: [], created: []};
  return new Promise(function (resolve, reject) {
    User.where({id:id}).getAllEvents()
    .then((events) => {
      compiledEvents.invitedTo = events.invitedTo;
      compiledEvents.created = events.created;
      return Promise.all(compiledEvents.created.map((event) => {
        return event.where({id:event.id}).getInfo()
      }))
    })
    .then((events) => {
      compiledEvents.created = events.map(event => event.serialize());
      return Promise.all(compiledEvents.invitedTo.map((event) => {
        return event.where({id:event.id}).getInfo()
      }))
    })
    .then((events) => {
      compiledEvents.invitedTo = events.map(event => event.serialize());
      return new User({id: id}).fetch()
    })
    .then((user) => {
      compiledEvents.creator = user.serialize();
      resolve(compiledEvents);
    });
  });
};

// Get specific events given event id
exports.getEventFromId = (event_id) => {
  return new Promise(function (resolve, reject) {
    Event.where({id:event_id}).getInfo()
    .catch((err) => reject(err))
    .then((event) => {
      resolve(event);
    })
  });
};

// Update event details given event id
exports.updateEventFromId = (event_id, updateAttributes) => {
  return new Promise(function (resolve, reject) {
    new Event({id:event_id}).save(updateAttributes, {patch: true})
    .catch((err) => {
      reject('Could not update event, please try again');
    })
    .then((event) => {
      resolve(event);
    });
  })
};

// Delete event with given event id
// <-- Not working for Event ? but working for user
exports.deleteEventFromId = (event_id) => {
  return new Promise(function (resolve, reject) {
    new Event({id: event_id}).destroy()
    .catch((err) => {
      reject('Could not delete event')
    })
    .then((event) => {
      resolve(event + ' deleted')
    });
  });
};

// Invite User to Event given event id and user id
exports.requestORInviteToJoinEvent = (id, event_id, options) => {
  return new Promise(function (resolve, reject) {
    Event.where({id:event_id}).attachInvitees(id,'unconfirmed')
    .then((result) => {
      if(result) {
        resolve(result);
      } else {
        reject('Could not get event', event_id);
      }
    });
  });
};

// Reject Invitation to join event given event id and user id
exports.rejectInvitationToJoinEvent = (id, event_id) => {
  return new Promise(function (resolve, reject) {
    Event.where({id:event_id}).removeInvitees(id)
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject('Something went wrong, please try again');
    });
  });
};

// Accept Invitation to join event given event id and user id
exports.acceptInvitationToJoinEvent = (id, event_id) => {
  return new Promise(function (resolve, reject) {
    new Event({id: event_id}).fetch()
    .then((result) => {
      return result.acceptRequestORInvitation(id)
    })
    .catch(err => {
      reject(err);
    })
    .then(result => {
      resolve('Success! User has confirmed invite to event');
    })

  });
};

// Upvote an event
exports.voteForEvent = (id, event_id) => {
  return new Promise(function (resolve, reject) {
    Event.where({id: eventId}).vote(userId, true)
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject('Something went wrong, please try again');
    });
  });
};

// Downvote an event
exports.unvoteForEvent = (id, event_id) => {
  return new Promise(function (resolve, reject) {
    Event.where({id: eventId}).vote(userId, false)
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject('Something went wrong, please try again');
    });
  });
};

exports.getAllUsersGroups = (id) => {
  return new Promise(function (resolve, reject) {
    let id = 1,
    data = {};
    User.where({id:id}).fetch({withRelated: ['groupsBelongingTo','groupsCreated']})
    .then((groups) => {
      if(groups) {
        data.groupsBelongingTo = groups.related('groupsBelongingTo');
        data.groupsCreated = groups.related('groupsCreated');
        resolve(data);
      } else {
        reject('Looks like you don\'t have any active groups');
      }
    })
    .catch((err) => {
      res.send(err);
    });
  });
};
