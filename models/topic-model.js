const db = require(`${__dirname}/../db/connection`)

exports.selectsAllTopics = ()=>{
return db.query(`SELECT * FROM topics`).then(({rows})=>{
  return rows
})
}