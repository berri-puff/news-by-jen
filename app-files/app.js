const express = require('express')
const { getTopics } = require('../controllers/topic-controller')
const { invalidPaths, serverErrors } = require('./errors')

const app = express()


app.get('/api/topics', getTopics)
app.all('*', invalidPaths)

app.use(serverErrors)

module.exports = app