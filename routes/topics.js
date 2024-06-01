const {
  topicsControllers: { postTopic, getTopics },
} = require("../controllers");

const topicsRouter = require("express").Router();

topicsRouter
.route("/")
.post(postTopic)
.get(getTopics);

module.exports = topicsRouter;
