const express = require('express')
const { getTopics } = require('../controllers/topic-controller')
const { invalidPaths, serverErrors } = require('./errors')

const app = express()
module.exports = app

app.get('/api/topics', getTopics)
app.get('*', invalidPaths)

app.use(serverErrors)