const express = require('express');
const {getTopics} = require('./controllers/app.api.topics.controllers')
const {getEndpoints} = require('./controllers/app.api.controllers')
const {handleGeneric404Errors, handleServerErrors} = require('./errorHandling/index')
const app = express()

app.get("/api/topics", getTopics)
app.get("/api", getEndpoints)
// app.get("/api/articles/:article_id", getArticlesById)

app.use(handleGeneric404Errors)
app.use(handleServerErrors)

module.exports = app