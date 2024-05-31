const {
  topicsControllers: { getTopics },
} = require("../controllers");

const topicsRouter = require("express").Router();

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
