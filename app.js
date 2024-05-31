const express = require("express");
const apiRouter = require("./routes/api");
const {
  handleGeneric404Errors,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errorHandling/index");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleGeneric404Errors);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
