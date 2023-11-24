const { getsAllArticles, getsArticle, getArticleComments, patchArticleVote, postNewArticle, postsNewComment} = require(`${__dirname}/../controllers/article-controller`)

const articlesRouter = require('express').Router()

articlesRouter.route('/')
.get(getsAllArticles)
.post(postNewArticle)

articlesRouter.route('/:article_id')
.get( getsArticle)
.patch(patchArticleVote)

articlesRouter.route('/:article_id/comments')
.get(getArticleComments)
.post(postsNewComment)

module.exports = articlesRouter