const { selectsAllUsers } = require("../models/user-model")

exports.getsUsers = (req,res,next)=>{
selectsAllUsers().then((retrievedUsers)=>{
res.status(200).send({users: retrievedUsers})
})
}