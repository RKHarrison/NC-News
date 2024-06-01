const {
  articlesControllers: {
    postArticle,
    getArticles,
    getArticleById,
    patchArticleById,
    deleteArticleById,
  },
  commentsControllers: { getCommentsByArticleId, postCommentByArticleId },
} = require("../controllers/");

const articlesRouter = require("express").Router();

articlesRouter.route("/").post(postArticle).get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
