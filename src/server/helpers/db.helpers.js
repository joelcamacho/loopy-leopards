const Promise = require('promise');
const User = require('../db/models/user.js');

// ~~~~~~~~~~~~~~~~~ AUTH ~~~~~~~~~~~~~~~~~ 
// Get Current User's Id from current auth (google_id)
exports.getUserIdFromGoogleId = google_id => {
  return new Promise(function (resolve, reject) {
    if(!google_id) return reject('invalid google_id');
    new User({google_id: google_id}).fetch()
    .then(user => {
      if(!!user) {
        resolve(user.get('id'));
      } else {
        reject('invalid google_id');
      }
    })
  });
}

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
    })
  });
}

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
}

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
}

// Get Current User's Token
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
}

// Create new User given options obj
exports.createNewUser = options => {
  return new Promise(function (resolve, reject) {
    User.forge(options).save()
    .then((user) => {
      // What is this if statement for?
      if(user.get('email') === null && user.get('google_id') === null) {
        resolve('added ' + user.get('name'))
      } else {
        resolve('Welcome, ' + user.get('first_name'));
      }
    })
    .catch((err) => {
      if(err.code = "ER_DUP_ENTRY") {
        reject('Uh-oh. It looks like that phone number is already in our system!')
      } else {
        reject('Something went wrong, please try again')
      }
    })
  });
}

// Update current User information given options obj
exports.updateCurrentUserFromId = (id, options) => {
  return new Promise(function (resolve, reject) {
    new User({id: id}).save(options, {patch: true})
    .then(user => resolve(user))
    .catch(err => reject(err));
  });
}

// Delete Current User
exports.deleteCurrentUserFromId = (id, options) => {
  return new Promise(function (resolve, reject) {
    new User({id: id}).destroy()
    .then(user => resolve('Sorry to see you go, ' + user.get('name')))
    .catch(err => reject('Could not close account'));
  });
}


// ~~~~~~~~~~~~~~~~~ GROUP ~~~~~~~~~~~~~~~~~ 
// Send Request to join group given group id
// Accept / Reject Invitation to join group given group id
// Get all group information
// Get Current User's Group Information
// Create a new group and set owner and group options obj
// Invite a user to a group given user id
// Accept / Reject a user's request to join the group given user id

// ~~~~~~~~~~~~~~~~~ EVENT ~~~~~~~~~~~~~~~~~ 
// TODO: add event helper methods


