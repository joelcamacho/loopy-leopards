const rp = require('request-promise');

const apiKeys = {
    yelpClientId : '',
    yelpClientSecret: '',
    yelpAccessToken: '',
    googleClientId: '',
    googleClientSecret: '',
    eventbriteAccessToken: '',
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioFromNumber: '',
    fcmServerKey: ''
}

// Get Yelp Access Token
rp.post(`https://api.yelp.com/oauth2/token?client_id=${apiKeys.yelpClientId}&client_secret=${apiKeys.yelpClientSecret}`)
    .then((body) => apiKeys.yelpAccessToken = JSON.parse(body).access_token) 
    .catch((error) => console.log(error));

module.exports = apiKeys;