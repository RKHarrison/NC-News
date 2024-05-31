const { commentsControllers: { deleteCommentById } } = require('../controllers');
const commentsRouter = require('express').Router();


commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;