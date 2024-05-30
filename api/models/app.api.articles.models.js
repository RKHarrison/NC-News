const db = require("../../db/connection");

exports.fetchArticles = (topic) => {
  const queryValues = [];
  let sqlQuery = `
    SELECT a.created_at, a.title, a.article_id, a.author, a.title, a.topic, a.votes, COUNT(comment_id) AS comment_count 
    FROM articles a 
    LEFT JOIN comments c ON a.article_id = c.article_id 
  `;

  if (topic) {
    sqlQuery += "WHERE a.topic = $1 ";
    queryValues.push(topic);
  }

  sqlQuery += "GROUP BY a.article_id ORDER BY a.created_at DESC;";

  return db.query(sqlQuery, queryValues).then((articles) => {
    return articles.rows;
  });
};

exports.fetchArticleById = (article_id, count) => {
  const queryValues = [article_id];
  let sqlQuery;

  if (count && count === "comments") {
    sqlQuery = `
  SELECT a.*, COUNT(c.comment_id)::INT AS comment_count 
  FROM articles a
  LEFT JOIN comments c ON c.article_id = a.article_id
  WHERE a.article_id = $1
  GROUP BY a.article_id;
  `;
  } else {
    sqlQuery = `SELECT * FROM articles WHERE article_id = $1;`;
  }

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    const article = rows[0];

    if (!article) {
      return Promise.reject({ status: 404, msg: "Resource Not Found" });
    }
    return article;
  });
};

exports.updateArticleById = (article_id, inc_votes) => {
  const queryValues = [inc_votes, article_id];
  const sqlQuery = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    ;`;

  return db.query(sqlQuery, queryValues).then(({ rows }) => rows[0]);
};
