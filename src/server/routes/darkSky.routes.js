const routes = require('express').Router();
const apiKeys = require('../config/config.js');
const rp = require('request-promise');

routes.post('/api/weather', (req, res) => {
  let latitude = req.body.latitude || null;
  let longitude = req.body.longitude || null;
  let time = req.body.time || null;

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






