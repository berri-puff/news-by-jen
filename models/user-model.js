const db = require('../db/connection.js')

exports.selectsAllUsers = ()=>{
    return db.query(`SELECT * FROM users`).then(({rows})=>{
        return rows
    })
}