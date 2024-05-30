const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
} = require("../models/app.api.comments.models");
const checkExists = require("../utils/check-exists")

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    fetchCommentsByArticleId(article_id),
    checkExists("articles", "article_id", article_id),
  ])
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  Promise.all([
    checkExists("articles", "article_id", article_id),
    checkExists("users", "username", username),
  ])
    .then(() => {
      return insertCommentByArticleId(article_id, username, body);
    })
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  checkExists("comments", "comment_id", comment_id)
    .then(() => {
      return removeCommentById(comment_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
