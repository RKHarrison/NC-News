const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => rows);
};

exports.fetchUserById = (username) => {
  const queryValues = [username];
  const sqlQuery = `SELECT * FROM users 
        WHERE username = $1;`;

  return db.query(sqlQuery, queryValues).then(({ rows }) => rows[0]);
};
