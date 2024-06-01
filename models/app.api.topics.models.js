const db = require("../db/connection");

exports.insertTopic = (slug, description) => {
  const queryValues = [slug, description]
  const sqlQuery = `
  INSERT INTO topics
  (slug, description)
  VALUES
  ($1, $2)
  RETURNING *
  `
  return db.query(sqlQuery, queryValues).then(({rows}) => rows[0])
}

exports.fetchTopics = () => {
  const sqlQuery = "SELECT * FROM topics";
  return db.query(sqlQuery).then(({rows}) => rows);
};


