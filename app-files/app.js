const express = require("express");
const { getTopics } = require(`${__dirname}/../controllers/topic-controller`);
const {
  invalidPaths,
  serverErrors,
  customErrors,
  psqlErrors,
} = require(`${__dirname}/./errors`);
const { getsArticle, getsAllArticles, getArticleComments, postsNewComment, patchArticleVote } = require(`${__dirname}/../controllers/article-controller`);
const { getsAllApi } = require(`${__dirname}/../controllers/api-controller`);
const { deletesComment } = require(`${__dirname}/../controllers/comments-controller`);
const { getsUsers } = require(`${__dirname}/../controllers/user-controller`);

const app = express();
app.use(express.json());

app.get('/api', getsAllApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getsArticle);
app.get('/api/articles/:article_id/comments', getArticleComments)
app.get('/api/articles', getsAllArticles);
app.get('/api/users', getsUsers)

app.patch('/api/articles/:article_id', patchArticleVote)

app.post('/api/articles/:article_id/comments', postsNewComment)

app.delete('/api/comments/:comment_id', deletesComment)

app.all("*", invalidPaths);

app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
