const db = require("../db/connection");

exports.insertArticle = (author, title, body, topic, article_img_url) => {
  const queryValues = [author, title, body, topic];

  let sqlQuery = `
    INSERT INTO articles
    (author, title, body, topic`;

  if (article_img_url) {
    queryValues.push(article_img_url);
    sqlQuery += `, article_img_url) VALUES ($1 ,$2, $3, $4, $5) RETURNING *`;
  } else {
    sqlQuery += `) VALUES ($1 ,$2, $3, $4) RETURNING *`;
  }

  return db.query(sqlQuery, queryValues).then(({ rows }) => rows[0]);
};

exports.fetchArticles = (topic, order = "DESC", sort_by = "created_at") => {
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

  const queryValues = [];
  let sqlQuery = `
    SELECT a.created_at, a.title, a.article_id, a.author, a.title, a.topic, a.votes, COUNT(comment_id)::INT AS comment_count 
    FROM articles a 
    LEFT JOIN comments c ON a.article_id = c.article_id 
  `;

  if (topic) {
    sqlQuery += "WHERE a.topic = $1 ";
    queryValues.push(topic);
  }

  sqlQuery += "GROUP BY a.article_id";
  sqlQuery += ` ORDER BY a.${sort_by} ${order}`;

  return db.query(sqlQuery, queryValues).then((articles) => articles.rows);
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
