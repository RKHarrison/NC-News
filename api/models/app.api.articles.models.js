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

exports.fetchArticles = () =>{
    const sqlQuery = `
    SELECT     a.created_at, 
    a.article_id, 
    a.author, 
    title, 
    topic, 
    a.votes, 
    a.article_id, 
    COUNT(comment_id) AS comment_count
FROM articles a
LEFT JOIN comments c ON a.article_id = c.article_id
GROUP BY   a.title,
    a.created_at, 
    a.article_id, 
    a.author, 
    a.title, 
    a.topic, 
    a.votes
ORDER BY a.created_at DESC;
`

return db.query(sqlQuery).then(articles => articles.rows)
}