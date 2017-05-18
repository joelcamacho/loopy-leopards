
exports.up = function(knex, Promise) {
  return Promise.all([
  	knex.schema.createTable('users', function(table) {
  		table.increments('id').primary();
  		table.string('first_name',[20]);
  		table.string('last_name',[20]);
  		table.string('email',[25]).unique();
      table.string('address');
      table.string('city');
      table.string('state', [2])
  		table.string('phone',[11]);
  		table.date('birthdate');
  	}),
  	knex.schema.createTable('activities', function(table) {
  		table.increments('id').primary();
  		table.string('title');
  		table.date('date');
  		table.string('description');
  		table.string('address');
      table.string('city');
      table.string('state', [2])
  		table.string('phone');
  		table.string('coordinates');
  		table.string('cost');
  		table.string('status').defaultTo('unconfirmed');
  		table.dateTime('voting_deadline');
  		table.timestamps([true],[true]);
  		table.integer('suggested_by').unsigned();
  		table.foreign('suggested_by').references('users.id');
  	}),    
  	knex.schema.createTable('groups', function(table) {
  		table.increments('id').primary();
  		table.string('name');
  		table.integer('creator').unsigned();
  		table.foreign('creator').references('users.id');
  	}),
    knex.schema.createTable('tags', function(table) {
      table.increments('id').primary();
      table.string('name');
    })
  ]);
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users')
    .dropTable('activities')
    .dropTable('groups')
    .dropTable('tags')
};
