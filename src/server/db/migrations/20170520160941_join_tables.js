
exports.up = function(knex, Promise) {
  return Promise.all([
  	knex.schema.createTable('events_users', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.id');
      table.integer('event_id').unsigned().notNullable();
      table.foreign('event_id').references('events.id');
    }),
    knex.schema.createTable('groups_users', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('users.id');
      table.integer('group_id').unsigned().notNullable()
      table.foreign('group_id').references('groups.id');
    }),
    knex.schema.createTable('tags_users', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('users.id');
      table.integer('tag_id').unsigned().notNullable()
      table.foreign('tag_id').references('tags.id');
    }),
    knex.schema.createTable('events_tags', function(table) {
      table.increments('id').primary();
      table.integer('tag_id').unsigned().notNullable()
      table.foreign('tag_id').references('tags.id');
      table.integer('event_id').unsigned().notNullable();
      table.foreign('event_id').references('events.id');
    })
    // ,
    // knex.schema.createTable('events_groups', function(table) {
    //   table.increments('id').primary();
    //   table.integer('event_id').unsigned().notNullable()
    //   table.foreign('event_id').references('events.id')
    //   table.integer('group_id').unsigned().notNullable()
    //   table.foreign('group_id').references('groups.id')
    // })
   ])
};

exports.down = function(knex, Promise) {
  
};
