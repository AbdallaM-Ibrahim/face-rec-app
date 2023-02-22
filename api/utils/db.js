require('dotenv').config();
module.exports = require("knex")({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'smart-brain'
  }
});
