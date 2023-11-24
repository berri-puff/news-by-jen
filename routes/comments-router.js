
const commentsRouter = require('express').Router()
const { patchCommentVote, deletesComment} = require(`${__dirname}/../controllers/comments-controller`);

commentsRouter.route('/:comment_id')
.patch(patchCommentVote)
.delete(deletesComment)

module.exports = commentsRouter
