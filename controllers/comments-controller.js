const { removesCommentById } = require("../models/comments-model")

exports.deletesComment = (req,res,next) =>{
    const {comment_id }= req.params
    removesCommentById(comment_id).then(()=>{
        res.status(204).send();
    }).catch(next)
}