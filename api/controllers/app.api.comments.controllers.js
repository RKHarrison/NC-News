const {fetchCommentsByArticleId} = require("../models/app.api.comments.models")

exports.getCommentsByArticleId = (req,res,next) => {
    const {article_id} = req.params
    fetchCommentsByArticleId(article_id).then(commentsForArticle =>{
        res.status(200).send({commentsForArticle})
    }).catch(next)
}