
exports.invalidPaths = (req,res)=>{
res.status(400).send({msg: 'bad request'})
}

exports.serverErrors =(err,req,res,next) =>{
    res.status(500).send({msg: 'Interal server error :('})
}