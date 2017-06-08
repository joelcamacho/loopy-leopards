const routes = require('express').Router();
const apiKeys = require('../config/config.js');
const rp = require('request-promise');

routes.post('/api/weather', (req, res) => {
  console.log(req.body)
  let latitude = req.body.latitude || 42.3601;
  let longitude = req.body.longitude || -71.0589;
  let time = 409467600;

	const options = {
	    uri: `https://api.darksky.net/forecast/${apiKeys.darkSky}/${latitude},${longitude},${time}?`,
	    qs: {
        exclude: "flags",
	    },
	    headers: {
	    },
	};

  rp(options)
  .then(function(response) {
    res.status(200).send({result: response});
  })
  .catch(function(err) {
    console.log(err);
    res.status(400).send({result: 'Something\s wrong, please try again!'})
  })
});

module.exports = routes;






