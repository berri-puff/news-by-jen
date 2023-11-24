const { getsAllApi } = require(`${__dirname}/../controllers/api-controller`)

const apiRouter = require('express').Router();

apiRouter.get('/', getsAllApi)

module.exports = apiRouter