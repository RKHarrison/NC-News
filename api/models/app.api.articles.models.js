const db = require("../../db/connection");

exports.fetchArticleById = (article_id) => {
  const queryValues = [article_id];

  const sqlQuery = `
    SELECT * FROM articles
    WHERE article_id = $1
    `;

    return db.query(sqlQuery, queryValues).then(data => {
        const article = data.rows[0]

        if(!article) {
            return Promise.reject({status: 404, msg: 'Resource Not Found'})
        }
        return article
    })
};
