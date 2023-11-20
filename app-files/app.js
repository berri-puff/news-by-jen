const express = require('express')
const { getTopics } = require('../controllers/topic-controller')
const { invalidPaths, serverErrors } = require('./errors')
const { getsAllApi } = require('../controllers/api-controller')

const app = express()


app.get('/api/topics', getTopics)
app.get('/api', getsAllApi)

app.all('*', invalidPaths)
app.use(serverErrors)

module.exports = app