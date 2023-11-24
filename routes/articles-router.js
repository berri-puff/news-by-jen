
const { getsAllArticles, getsArticle, getArticleComments } = require(`${__dirname}/../controllers/article-controller`)

const articlesRouter = require('express').Router()

articlesRouter.get('/', getsAllArticles);

articlesRouter.get('/:article_id', getsArticle);

articlesRouter.get('/:article_id/comments', getArticleComments);

module.exports = articlesRouter