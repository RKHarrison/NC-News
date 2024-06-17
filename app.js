const express = require("express");
const apiRouter = require("./routes/api");
const {
  handleGeneric404Errors,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errorHandling/index");
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json());

app.use("/api", apiRouter);

app.use(handleGeneric404Errors);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
