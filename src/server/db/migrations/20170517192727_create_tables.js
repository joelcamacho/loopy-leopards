exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('first_name',[15]).notNullable();
      table.string('last_name',[15]);
      table.string('google_id');
      table.string('email',[25]).unique();
      table.string('password')
      table.string('address',[20]);
      table.string('city',[20]);
      table.string('state', [2]);
      table.string('latitude');
      table.string('longitude');
      table.string('phone',[11]).unique().notNullable();
      table.date('birthdate');
      table.boolean('registered')
      table.boolean('phoneValidated').defaultTo(false)
    }),
    knex.schema.createTable('events', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.dateTime('date_time').notNullable();
      table.string('description');
      // .notNullable();
      table.string('address',[20]);
      table.string('city',[20]);
      table.string('state', [2]);
      table.string('phone',[11]);
      table.string('latitude');
      //.notNullable()
      table.string('longitude');
      // .notNullable();
      table.string('cost',[4]);
      table.string('status').defaultTo('suggested');
      table.dateTime('voting_deadline');
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