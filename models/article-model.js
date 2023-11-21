
const db = require('../db/connection')
exports.getArticleByID = (article_id)=>{

return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({rows})=>{
   if (rows.length === 0){
    return Promise.reject({status: 404, msg:'no article with this ID'})
   }
  else return rows[0]
})
}

exports.selectAllArticles = ()=>{
  return db.query(`SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.body) AS comment_counts FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`).then(({rows})=>{
    return rows
  })
}

exports.selectCommentByArticleID = (article_id)=>{
 return db.query(`SELECT articles.article_id, comments.author, comments.created_at, comments.votes, comments.comment_id, comments.body FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE comments.article_id = $1 ORDER BY comments.created_at`, [article_id]).then(({rows})=>{
  return rows
 })
}
exports.updatesVotes = (article_id, newVote)=>{
  const {inc_votes} = newVote
return db.query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`, [inc_votes, article_id]).then(({rows})=>{
  return rows[0]
})
}

