const db = require('../db/connection.js')
exports.removesCommentById = (comment_id)=>{
return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]).then((response)=>{
if(!response.rowCount){
    return Promise.reject({status: 404, msg: 'Not Found'})
}
})
}

exports.patchCommentVoteById = (inc_votes, comment_id) =>{
return db.query(`SELECT votes FROM comments WHERE comment_id = $1`, [comment_id]).then(({rows}) =>{
   if (!rows.length){
    return Promise.reject({status: 404, msg: 'Not Found'})
   }
   else {
    const oldVote = rows[0].votes
    let newVote = oldVote + inc_votes
    return db.query(`UPDATE comments SET votes = ${newVote} WHERE comment_id = $1 RETURNING *`, [comment_id]).then(({rows})=>{
        return rows[0]
    })
   }
    
})
}