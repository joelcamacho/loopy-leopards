const routes = require('express').Router();
const yelpRoutes = require('./yelp.routes.js');
const eventbriteRoutes = require('./eventbrite.routes.js')

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.use(yelpRoutes);
routes.use(eventbriteRoutes);


module.exports = routes;