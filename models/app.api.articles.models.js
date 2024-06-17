const db = require("../db/connection");
const format = require("pg-format");

exports.insertArticle = (author, title, body, topic, article_img_url) => {
  let queryColumns = "author, title, body, topic";
  const queryValues = [author, title, body, topic];

  if (article_img_url) {
    queryColumns += ", article_img_url";
    queryValues.push(article_img_url);
  }

  let formattedSqlQuery = format(
    `INSERT INTO articles
    (${queryColumns})
    VALUES
    (%L) 
    RETURNING *;`,
    queryValues
  );

  return db.query(formattedSqlQuery).then(({ rows }) => rows[0]);
};

exports.fetchArticles = (
  topic,
  order = "DESC",
  sort_by = "created_at",
  limit,
  page
) => {
  const allowedOrders = ["ASC", "DESC"];
  const allowedSortBys = [
    "comment_count",
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
  ];

  if (
    order &&
    sort_by &&
    !allowedOrders.includes(order) &&
    !allowedSortBys.includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Bad Query Request" });
  }
  if (order && !allowedOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Order Request" });
  }
  if (sort_by && !allowedSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Sort Request" });
  }

  let sqlQuery = `
    SELECT a.created_at, a.title, a.article_img_url,a.article_id, a.author, a.title, a.topic, a.votes, COUNT(comment_id)::INT AS comment_count 
    FROM articles a 
    LEFT JOIN comments c 
    ON a.article_id = c.article_id `;

  if (topic) {
    sqlQuery += format(`WHERE a.topic = %L `, topic);
  }
  sqlQuery += format("GROUP BY a.article_id ORDER BY a.%I %s ", sort_by, order);

  if (limit) {
    sqlQuery += format(`LIMIT %L `, limit);
  }
  if (page) {
    const offset = limit * (page - 1);
    sqlQuery += format(`OFFSET %L `, offset);
  }
  sqlQuery += ";";

  return db.query(sqlQuery).then((articles) => articles.rows);
};

exports.fetchArticleById = (article_id) => {
  const queryValues = [article_id];
  const sqlQuery = `
  SELECT a.*, COUNT(c.comment_id)::INT AS comment_count 
  FROM articles a
  LEFT JOIN comments c ON c.article_id = a.article_id
  WHERE a.article_id = $1
  GROUP BY a.article_id;
  `;

  return db.query(sqlQuery, queryValues).then(({ rows }) => rows[0]);
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

exports.removeArticleById = (article_id) => {
  const queryValues = [article_id];
  const sqlQuery = "DELETE FROM articles WHERE article_id = $1";
  return db.query(sqlQuery, queryValues);
};
