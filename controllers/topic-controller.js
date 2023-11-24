
const { selectsAllTopics, addsNewTopic } = require(`${__dirname}/../models/topic-model`)

exports.getTopics = (req,res)=>{
    selectsAllTopics().then((response) =>{
        res.status(200).send({topics: response})
    })
}

exports.postNewTopic = (req,res, next) =>{
    const newTopic = req.body
    addsNewTopic(newTopic).then((addedTopic) =>{
        res.status(200).send({topic: addedTopic})
    }).catch(next)
}