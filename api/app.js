const express = require('express');
const {
    apiControllers: { getEndpoints },
    topicsControllers: { getTopics },
    articlesControllers: { getArticles, getArticleById, patchArticleById },
    commentsControllers: { getCommentsByArticleId, postCommentByArticleId, deleteCommentById },
  } = require('./controllers');
const {handleGeneric404Errors, handleCustomErrors, handlePsqlErrors, handleServerErrors} = require('./errorHandling/index')

const app = express()
app.use(express.json());


app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleById)
app.patch("/api/articles/:article_id", patchArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postCommentByArticleId)
app.delete("/api/comments/:comment_id", deleteCommentById)


app.use(handleGeneric404Errors)
app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

module.exports = app