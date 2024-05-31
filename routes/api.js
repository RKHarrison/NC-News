const { apiControllers: { getEndpoints }} = require("../controllers/");

const apiRouter = require("express").Router();

const articlesRouter = require("./articles");
const commentsRouter = require("./comments");
const usersRouter = require("./users")
const topicsRouter = require("./topics")


apiRouter.get("/", getEndpoints);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter)






module.exports = apiRouter;
