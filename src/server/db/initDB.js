var conn = {
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  charset  : 'utf8'
};

// connect without database selected
var knex = require('knex')({ client: 'mysql', connection: conn});

return knex.raw('DROP DATABASE hanginhubs_dev;')
  .then(function() {
    return knex.raw('CREATE DATABASE hanginhubs_dev;')
  })
  .catch(function() {
    return knex.raw('CREATE DATABASE hanginhubs_dev;')
  })
  .then(function () {
    console.log("Migrating...");
     // connect with database selected
    conn.database = 'hanginhubs_dev';
    knex = require('knex')({ client: 'mysql', connection: conn});

    return knex.migrate.latest({
      directory: __dirname + '/migrations'
    })
  })
  .then(function() {
    console.log("Done");
    process.exit;
  });
