// dependencies
const express = require('express');
const morgan  = require('morgan');

const app = express();
const routes = require('./routes');

// add morgan middleware logger
app.use(morgan('short'))

// serve client app
app.use(express.static(__dirname + '/../client'));

//  Connect routes
app.use('/', routes);


app.listen(process.env.PORT || 3000, () => {
  console.log('App listening on port', (process.env.PORT || 3000));
});