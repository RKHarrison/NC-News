const format = require('pg-format')
const db = require('../db/connection')

checkExists = async (table, column, value) => {
    const sqlQuery = format('SELECT * FROM %I WHERE %I = $1;', table, column)
    const dbOutput = await db.query(sqlQuery, [value])
  
    if (dbOutput.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Resource Not Found' });
    }
  }

  module.exports = checkExists