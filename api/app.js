const express = require('express');
const {getTopics} = require('./controllers/app.topics.controllers')
const {handleServerErrors} = require('./errorHandling/index')
const app = express()

app.get("/api/topics", getTopics)

app.use(handleServerErrors)

module.exports = app