const { insertTopic, fetchTopics } = require("../models/app.api.topics.models");

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;

  insertTopic(slug, description)
    .then((postedTopic) => {
      res.status(201).send({ postedTopic });
    })
    .catch(next);
};

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
