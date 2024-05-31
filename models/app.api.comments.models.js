const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id, limit, p) => {
  const queryValues = [article_id];
  let sqlQuery = `SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC`;
  if (limit) {
    sqlQuery += ` LIMIT $${queryValues.length + 1}`;
    queryValues.push(limit);
  }
  if (p) {
    sqlQuery += ` OFFSET $${queryValues.length+1}`
    queryValues.push(p)
  }
  return db.query(sqlQuery, queryValues).then(({ rows }) => rows);
};

exports.insertCommentByArticleId = (article_id, username, body) => {
  const queryValues = [article_id, username, body];
  const sqlQuery = `
    INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1 ,$2, $3)
    RETURNING *
    `;
  return db.query(sqlQuery, queryValues).then(({ rows }) => rows[0]);
};

exports.updateCommentById = (comment_id, inc_votes) => {
  const queryValues = [inc_votes, comment_id];
  const sqlQuery = `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *
    ;`;

  return db.query(sqlQuery, queryValues).then(({ rows }) => rows[0]);
};

exports.removeCommentById = (comment_id) => {
  const queryValues = [comment_id];
  const sqlQuery = "DELETE FROM comments WHERE comment_id = $1";
  return db.query(sqlQuery, queryValues);
};
