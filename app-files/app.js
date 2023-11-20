const express = require("express");
const { getTopics } = require("../controllers/topic-controller");
const {
  invalidPaths,
  serverErrors,
  customErrors,
  psqlErrors,
} = require("./errors");
const { getsArticle } = require("../controllers/article-controller");
const { getsAllApi } = require('../controllers/api-controller')

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getsArticle);
app.get('/api', getsAllApi)
app.all("*", invalidPaths);

app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
