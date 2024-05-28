const express = require('express');
const {getTopics, getEndpoints} = require('./controllers/app.topics.controllers')
const {handleGeneric404Errors, handleServerErrors} = require('./errorHandling/index')
const app = express()

app.get("/api/topics", getTopics)
app.get("/api", getEndpoints)


app.use(handleGeneric404Errors)
app.use(handleServerErrors)

module.exports = app