exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('first_name',[15]).notNullable();
      table.string('last_name',[15]).notNullable();
      table.string('email',[25]).unique().notNullable();
      table.string('password',[15]).notNullable();
      table.string('address',[20]).notNullable();
      table.string('city',[20]).notNullable();
      table.string('state', [2]).notNullable();
      table.string('phone',[11]).notNullable();
      table.date('birthdate');
    }),
    knex.schema.createTable('activities', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.date('date').notNullable();
      table.string('description');
      table.string('address',[20]);
      table.string('city',[20]);
      table.string('state', [2]);
      table.string('phone',[11]);
      table.string('coordinates').notNullable();
      table.decimal('cost',[2]);
      table.string('status').defaultTo(null);
      table.dateTime('voting_deadline').notNullable();
      table.timestamps([true],[true]);
      table.integer('suggested_by_user_id').unsigned();
      table.foreign('suggested_by_user_id').references('users.id');
    }),    
    knex.schema.createTable('groups', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('creator_id').unsigned();
      table.foreign('creator_id').references('users.id');
    }),
    knex.schema.createTable('tags', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
    }),
    knex.schema.createTable('users_activities', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id');
      table.integer('activity_id').unsigned();
      table.foreign('activity_id').references('activities.id');
    }),
    knex.schema.createTable('users_groups', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id');
      table.integer('group_id').unsigned();
      table.foreign('group_id').references('groups.id');
    }),
    knex.schema.createTable('users_tags', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id');
      table.integer('tag_id').unsigned();
      table.foreign('tag_id').references('tags.id');
    }),
    knex.schema.createTable('tags_activities', function(table) {
      table.increments('id').primary();
      table.integer('tag_id').unsigned();
      table.foreign('tag_id').references('tags.id');
      table.integer('activity_id').unsigned();
      table.foreign('activity_id').references('activities.id');
    }),
    knex.schema.createTable('groups_activities', function(table) {
      table.increments('id').primary();
      table.integer('group_id').unsigned();
      table.foreign('group_id').references('groups.id');
      table.integer('activity_id').unsigned();
      table.foreign('activity_id').references('activities.id');
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
    .dropTable('activities_tags')
    .dropTable('activities_groups');
};