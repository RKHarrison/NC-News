const { checkArticleExists } = require("../models/app.api.articles.models");
const { checkUserExists } = require("../models/app.api.users.models");
const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById
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
  const { username, body } = req.body;

  Promise.all([checkArticleExists(article_id), checkUserExists(username)])
    .then(() => {
      return insertCommentByArticleId(article_id, username, body);
    })
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch(next);
};

exports.deleteCommentById = (req,res,next) => {
  const { comment_id } = req.params

  removeCommentById(comment_id).then(()  => {
    res.status(204).send()
  }).catch(next)
}
