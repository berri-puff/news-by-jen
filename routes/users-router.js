
const { getsUsers, getUserInfo} = require(`${__dirname}/../controllers/user-controller`)

const usersRouter = require('express').Router()

usersRouter.get('/', getsUsers)

usersRouter.get('/:username', getUserInfo)

module.exports = usersRouter