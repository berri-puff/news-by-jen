
const db = require('../db/connection')
exports.getArticleByID = (article_id)=>{

return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({rows})=>{
   if (rows.length === 0){
    return Promise.reject({status: 404, msg:'no article with this ID'})
   }
  else return rows[0]
})
}