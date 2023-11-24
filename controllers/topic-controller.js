const { selectsAllTopics } = require(`${__dirname}/../models/topic-model`)

exports.getTopics = (req,res)=>{
    selectsAllTopics().then((response) =>{
        res.status(200).send({topics: response})
    })
}