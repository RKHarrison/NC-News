const {
  fetchArticles,
  fetchArticleById,
  updateArticleById,
} = require("../models/app.api.articles.models");
const checkExists = require("../utils/check-exists")

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  checkExists('articles', 'article_id', article_id)
    .then(() => {
      return updateArticleById(article_id, inc_votes);
    })
    .then((patchedArticle) => {
      res.status(200).send({ patchedArticle });
    })
    .catch(next);
};
