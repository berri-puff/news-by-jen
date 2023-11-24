
const { getTopics, postNewTopic } = require(`${__dirname}/../controllers/topic-controller`)

const topicsRouter = require('express').Router()
topicsRouter.route('/')
.get(getTopics)
.post(postNewTopic)

module.exports = topicsRouter