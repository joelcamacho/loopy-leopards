'use strict'

var env = 'development';

const knex = require('knex')(require('../knexfile.js')[env]),
    bookshelf = require('bookshelf')(knex);

bookshelf.plugin('registry');

module.exports = bookshelf;
