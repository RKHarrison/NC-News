const { checkArticleExists } = require("../models/app.api.articles.models");
const { checkUserExists } = require("../models/app.api.users.models");
const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
  checkCommentExists,
} = require("../models/app.api.comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    fetchCommentsByArticleId(article_id),
    checkExists("articles", "article_id", article_id),
  ])
    .then((resolvedPromises) => {
      const commentsForArticleId = resolvedPromises[0];
      res.status(200).send({ commentsForArticleId });
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

  checkCommentExists(comment_id)
    .then(() => {
      return removeCommentById(comment_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
