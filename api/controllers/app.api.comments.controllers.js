const { checkArticleExists } = require("../models/app.api.articles.models");
const {
  fetchCommentsByArticleId,
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
