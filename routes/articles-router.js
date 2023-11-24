
const { getsAllArticles, getsArticle, getArticleComments, patchArticleVote, postNewArticle} = require(`${__dirname}/../controllers/article-controller`)

const articlesRouter = require('express').Router()

articlesRouter.route('/')
.get(getsAllArticles)
.post(postNewArticle)

articlesRouter.route('/:article_id')
.get( getsArticle)
.patch(patchArticleVote)

articlesRouter.get('/:article_id/comments', getArticleComments);

module.exports = articlesRouter