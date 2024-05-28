const {fetchTopics} = require('../models/app.topics.models')

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  })
};
