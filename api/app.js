const express = require('express');
const {getTopics} = require('./controllers/app.api.topics.controllers')
const {getEndpoints} = require('./controllers/app.api.controllers')
const {getArticles, getArticleById} = require('./controllers/app.api.articles.controllers')
const {getCommentsByArticleId, postCommentByArticleId} = require('./controllers/app.api.comments.controllers')
const {handleGeneric404Errors, handleCustomErrors, handlePsqlErrors, handleServerErrors} = require('./errorHandling/index')

const app = express()
app.use(express.json());

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postCommentByArticleId)


app.use(handleGeneric404Errors)
app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

module.exports = app