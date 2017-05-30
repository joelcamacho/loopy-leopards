exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('first_name');
      table.string('last_name');
      table.string('google_id').unique();
      table.string('email');
      table.string('password')
      table.string('address');
      table.string('city');
      table.string('state');
      table.string('latitude');
      table.string('longitude');
      table.string('phone');
      table.date('birthdate');
      table.boolean('registered').defaultTo(false);
      table.boolean('phone_validated');
      table.string('token');
    }),
    knex.schema.createTable('events', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.dateTime('date_time')
      table.string('description','longtext');
      // .notNullable();
      table.string('address',[20]);
      table.string('city',[20]);
      table.string('state', [2]);
      table.string('phone',[14]);
      table.string('latitude');
      table.string('comments');
      //.notNullable()
      table.string('longitude');
      // .notNullable();
      table.string('cost',[4]);
      table.string('status').defaultTo('suggested');
      table.dateTime('voting_deadline');
      table.string('url');
      // .notNullable();
      table.integer('vote_count').defaultTo(1);
      table.timestamps([true],[true]);
      table.integer('creator_id').unsigned().notNullable();
      table.foreign('creator_id').references('users.id');
      table.integer('group_id').unsigned();
      table.foreign('group_id').references('groups.id');
    }),    
    knex.schema.createTable('groups', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.integer('creator_id').unsigned().notNullable();
      table.foreign('creator_id').references('users.id');
    }),
    knex.schema.createTable('tags', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
    .dropTable('activities')
    .dropTable('groups')
    .dropTable('tags')
    .dropTable('users_activities')
    .dropTable('users_groups')
    .dropTable('users_tags')
    .dropTable('tags_activities');
};