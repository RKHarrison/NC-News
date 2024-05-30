const {
  fetchArticles,
  fetchArticleById,
  updateArticleById,
} = require("../models/app.api.articles.models");
const checkExists = require("../utils/check-exists");

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;

  const promises = [fetchArticles(topic)];
  if (topic) promises.push(checkExists("topics", "slug", topic));

  Promise.all(promises)
    .then((resolvedPromises) => {
      const articles = resolvedPromises[0];
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { count } = req.query;

  fetchArticleById(article_id, count)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  Promise.all([
    updateArticleById(article_id, inc_votes),
    checkExists("articles", "article_id", article_id),
  ])
    .then((resolvedPromises) => {
      const patchedArticle = resolvedPromises[0];
      res.status(200).send({ patchedArticle });
    })
    .catch(next);
};
