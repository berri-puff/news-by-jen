const db = require(`${__dirname}/../db/connection`)

exports.selectsAllTopics = ()=>{
return db.query(`SELECT * FROM topics`).then(({rows})=>{
  return rows
})
}

exports.addsNewTopic = (newTopic)=>{
const {slug, description} = newTopic
return db.query(`INSERT INTO topics (slug, description) VALUES ($1,$2) RETURNING *`, [slug, description]).then(({rows}) =>{
  return rows[0]
})
}