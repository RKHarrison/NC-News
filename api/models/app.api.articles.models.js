const db = require("../../db/connection");

exports.fetchArticleById = (article_id) => {
  const queryValues = [article_id];

  const sqlQuery = `
    SELECT * FROM articles
    WHERE article_id = $1
    `;

    return db.query(sqlQuery, queryValues).then(article => {
        console.log(article.rows[0]);
        return article.rows[0]
    })
};
