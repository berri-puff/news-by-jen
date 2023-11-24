const { getTopics } = require(`${__dirname}/../controllers/topic-controller`)

const topicsRouter = require('express').Router()
topicsRouter.get('/', getTopics)

module.exports = topicsRouter