const db = require('../../db/connection')


exports.fetchCommentsByArticleId = (article_id) =>{
        const queryValues = [article_id]
        const sqlQuery = `SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC`
    
        return db.query(sqlQuery, queryValues).then(({rows: comments}) => {
            return comments
        })
}
