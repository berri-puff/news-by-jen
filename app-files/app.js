const express = require("express");
const { getTopics } = require("../controllers/topic-controller");
const {
  invalidPaths,
  serverErrors,
  customErrors,
  psqlErrors,
} = require("./errors");
const { getsArticle, getsAllArticles, getArticleComments, postsNewComment, patchArticleVote } = require("../controllers/article-controller");
const { getsAllApi } = require('../controllers/api-controller')

const app = express();
app.use(express.json())

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getsArticle);
app.get('/api/articles/:article_id/comments', getArticleComments)
app.get('/api', getsAllApi);

app.get('/api/articles', getsAllArticles);
app.patch('/api/articles/:article_id', patchArticleVote)


app.post('/api/articles/:article_id/comments', postsNewComment)

app.all("*", invalidPaths);


app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
