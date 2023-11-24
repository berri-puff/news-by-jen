const articlesRouter = require(`${__dirname}/./articles-router`);

const topicsRouter = require(`${__dirname}/./topics-router`);

const { getsAllApi } = require(`${__dirname}/../controllers/api-controller`)

const apiRouter = require('express').Router();

apiRouter.get('/', getsAllApi)
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/articles', articlesRouter)

module.exports = apiRouter