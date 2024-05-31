const {
  insertArticle,
  fetchArticles,
  fetchArticleById,
  updateArticleById,
} = require("../models/app.api.articles.models");
const checkExists = require("../utils/check-exists");

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  Promise.all([
    checkExists("topics", "slug", topic),
    checkExists("users", "username", author),
  ])
    .then(() => {
      return insertArticle(author, title, body, topic, article_img_url);
    })
    .then(({ article_id }) => {
      return fetchArticleById(article_id);
    })
    .then((postedArticle) => {
      res.status(201).send({ postedArticle });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, order, sort_by, limit, p } = req.query;

  const promises = [fetchArticles(topic, order, sort_by, limit, p)];
  if (topic) promises.push(checkExists("topics", "slug", topic));

  Promise.all(promises)
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    fetchArticleById(article_id),
    checkExists("articles", "article_id", article_id),
  ])
    .then(([article]) => res.status(200).send({ article }))
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  Promise.all([
    updateArticleById(article_id, inc_votes),
    checkExists("articles", "article_id", article_id),
  ])
    .then(([patchedArticle]) => {
      res.status(200).send({ patchedArticle });
    })
    .catch(next);
};
