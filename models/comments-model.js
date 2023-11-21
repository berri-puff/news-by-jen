const db = require('../db/connection.js')
exports.removesCommentById = (comment_id)=>{
return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]).then((response)=>{
if(!response.rowCount){
    return Promise.reject({status: 404, msg: 'Not Found'})
}
})
}