const db = require('../db/connection.js')

exports.selectsAllUsers = ()=>{
    return db.query(`SELECT * FROM users`).then(({rows})=>{
        return rows
    })
}

exports.selectsAUser = (username, activeMembers)=>{
    const trueUser = []
if (activeMembers.includes(username)){
    trueUser.push(username)
return db.query(`SELECT * FROM users WHERE username = $1`, trueUser).then(({rows})=>{
    return rows[0]
})
}

}