
const router = require('express').Router();

const yelpRoutes = require('./yelp.routes.js')


router.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

router.use(yelpRoutes);

module.exports = router;

