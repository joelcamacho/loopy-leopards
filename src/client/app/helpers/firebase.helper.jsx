// import config
import config from '../config/config.jsx';

// Initalize App and messaging
firebase.initializeApp(config);
const messaging = firebase.messaging();

const sendTokenToServer = (token) => {
  fetch('/api/push/register', { method: 'POST', 
    body: JSON.stringify({token: token}),
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },})
    .then(res => res.json())
    .then(res => {
      console.log(res);
      helpers.sendTestPushNotification();
    });
};


const deleteToken = () => {
  messaging.getToken()
  .then(function(currentToken) {
    messaging.deleteToken(currentToken)
    .then(function() {
      console.log('Token deleted.');
      sendUnregisterToServer();
    })
    .catch(function(err) {
      console.log('Unable to delete token. ', err);
    });
    // [END delete_token]
  })
  .catch(function(err) {
    console.log('Error retrieving Instance ID token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
  });
};

// requestPushNotificationPermissions
// deleteToken
// sendTestPushNotification
let helpers = {
  requestPushNotificationPermissions: () => {
    messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
      messaging.getToken()
        .then(function(currentToken) {
          if (currentToken) {
            messaging.onMessage(function(payload) {
              console.log("Message received. ", payload);
              // Handle message received when app is in forefront
            });
            sendTokenToServer(currentToken);
          } else {
            console.log('No Instance ID token available. Request permission to generate one.');
          }
        })
        .catch(function(err) {
          console.log('An error occurred while retrieving token. ', err);
        });

        messaging.onTokenRefresh(function() {
          messaging.getToken()
          .then(function(refreshedToken) {
            console.log('Token refreshed.');
            sendTokenToServer(refreshedToken);
          })
          .catch(function(err) {
            console.log('Unable to retrieve refreshed token ', err);
          });
        });
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
  },


  sendUnregisterToServer: () => {
    fetch('/api/push/unregister', { method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },})
    .then(res => res.json())
    .then(res => {
      console.log(res);
    });
  },

  sendTestPushNotification: () => {
    fetch('/api/push/notification', { method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },})
    .then(res => res.json())
    .then(res => {
      console.log(res);
    });
  }
}
export default helpers;