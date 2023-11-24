const express = require("express");
const apiRouter = require(`${__dirname}/../routes/api-router`)
const {
  invalidPaths,
  serverErrors,
  customErrors,
  psqlErrors,
} = require(`${__dirname}/./errors`);
const { postsNewComment, patchArticleVote, postNewArticle  } = require(`${__dirname}/../controllers/article-controller`);

const { deletesComment, patchCommentVote } = require(`${__dirname}/../controllers/comments-controller`);

const app = express();
app.use(express.json());

app.use('/api', apiRouter);

app.patch('/api/articles/:article_id', patchArticleVote)
app.patch('/api/comments/:comment_id', patchCommentVote)

app.post('/api/articles/:article_id/comments', postsNewComment)
app.post('/api/articles', postNewArticle)

app.delete('/api/comments/:comment_id', deletesComment)

app.all("*", invalidPaths);

app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
