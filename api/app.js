const express = require('express');
const {getTopics} = require('./controllers/app.api.topics.controllers')
const {getEndpoints} = require('./controllers/app.api.controllers')
const {getArticleById} = require('./controllers/app.api.articles.controllers')
const {handleGeneric404Errors, handleCustomErrors, handlePsqlErrors, handleServerErrors} = require('./errorHandling/index')
const app = express()

app.get("/api/topics", getTopics)
app.get("/api", getEndpoints)
app.get("/api/articles/:article_id", getArticleById)

app.use(handleGeneric404Errors)
app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

module.exports = app