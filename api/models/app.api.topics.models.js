const db = require("../../db/connection");

exports.fetchTopics = () => {
  const sqlQuery = "SELECT * FROM topics";
  return db.query(sqlQuery).then((topics) => topics.rows);
};


