const routes = require('express').Router();
const yelpRoutes = require('./yelp.routes.js')

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.use(yelpRoutes);


module.exports = routes;