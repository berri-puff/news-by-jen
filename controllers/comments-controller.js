

const { removesCommentById, patchCommentVoteById} = require(`${__dirname}/../models/comments-model`)

exports.deletesComment = (req,res,next) =>{
    const {comment_id }= req.params
    removesCommentById(comment_id).then(()=>{
        res.status(204).send();
    }).catch(next)
}

exports.patchCommentVote = (req,res,next) =>{
    const {inc_votes} = req.body
    const {comment_id} = req.params
patchCommentVoteById(inc_votes, comment_id).then((updatedComment)=>{
res.status(200).send({comment: updatedComment})
})
}