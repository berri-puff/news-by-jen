const express = require("express");
const apiRouter = require(`${__dirname}/../routes/api-router`)
const {
  invalidPaths,
  serverErrors,
  customErrors,
  psqlErrors,
} = require(`${__dirname}/./errors`);

const app = express();
app.use(express.json());

app.use('/api', apiRouter);

app.all("*", invalidPaths);

app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
