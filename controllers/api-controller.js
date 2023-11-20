const fs = require('fs/promises')

exports.getsAllApi = (req,res)=>{
    
    return fs.readFile(`${__dirname}/../endpoints.json`).then((contents)=>{
     const stringApiInfo = JSON.parse(contents)
    res.status(200).send({endpoints: stringApiInfo})
    })

}