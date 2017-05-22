// dependencies
const express = require('express');
const morgan  = require('morgan');
const bodyParser = require('body-parser')

const app = express();
const eventRouter = require('./routes/eventsRouter.js');
const config = require('./config/config.example.js');



// add morgan middleware logger
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('short'));


// serve client app
app.use(express.static(__dirname + '/../client'));

//  Connect routes
app.use('/api', eventRouter);


app.listen(process.env.PORT || 3000, () => {
  console.log('App listening on port', (process.env.PORT || 3000));
});

module.exports = app;