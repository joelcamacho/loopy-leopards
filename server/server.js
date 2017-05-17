const app = require('express')();
const routes = require('./server/routes');

//  Connect routes
app.use('/', routes);


app.listen(3000, () => {
  console.log('App listening on port 3000');
});