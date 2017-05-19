var request = require('request');

const apiKeys = {
	yelpClientId : '',
	yelpClientSecret: '',
	yelpAccessToken: ''
}


request.post(`https://api.yelp.com/oauth2/token?client_id=${apiKeys.yelpClientId}&client_secret=${apiKeys.yelpClientSecret}`,
	function (error, response, body) {
		if(error) {
			console.log(error);
		}
		else {
			apiKeys.yelpAccessToken = JSON.parse(body).access_token;
			console.log('yelp access token', apiKeys.yelpAccessToken);
		}
	});

module.exports = apiKeys;