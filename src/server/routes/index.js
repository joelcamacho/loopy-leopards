const routes = require('express').Router();

const yelpRoutes = require('./yelp.routes.js')
const googleAuthRoutes = require('./google.auth.routes.js')
const authRoutes = require('./auth.routes.js')
const eventbriteRoutes = require('./eventbrite.routes.js')
const eventsRouters= require('./events.routes.js');
const usersRoutes = require('./users.routes.js');
const groupRouter = require('./groups.routes.js');
const twilioRoutes = require('./twilio.routes.js');
const pushRoutes = require('./push.routes.js');
const googleMapRoutes = require('./google.map.routes.js');
const darkSkyRoutes = require('./darkSky.routes.js');

// middleware to protect routes
function ensureAuthenticated(req, res, next) {
	console.log(req.isAuthenticated());
	if (req.isAuthenticated()) {
		return next();
	} else {
		return res.redirect('/login')
	}
}

// auth routes
routes.use(googleAuthRoutes);
routes.use(authRoutes);

// TO PROTECT ROUTES, attach ensureAuthenticated function
// routes.get('/api/yelp', ensureAuthenticated);
routes.use(yelpRoutes);
routes.use(eventbriteRoutes);
routes.use(twilioRoutes);
routes.use(pushRoutes);
routes.use(googleMapRoutes);
routes.use(darkSkyRoutes);

routes.use('/api', eventsRouters, usersRoutes, groupRouter);

module.exports = routes;