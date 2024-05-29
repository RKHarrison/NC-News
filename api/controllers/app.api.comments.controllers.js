const { checkArticleExists } = require("../models/app.api.articles.models");
const {
  fetchCommentsByArticleId,
  insertCommentByArticleId
} = require("../models/app.api.comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  checkArticleExists(article_id)
    .then(() => {
      fetchCommentsByArticleId(article_id).then((commentsForArticleId) => {
        res.status(200).send({ commentsForArticleId });
      });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body} = req.body

    insertCommentByArticleId(article_id, username, body).then((postedComment) =>{
        res.status(201).send({postedComment})
    })
};
