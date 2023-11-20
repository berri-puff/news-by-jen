const { getArticleByID } = require("../models/article-model")

exports.getsArticle = (req,res, next)=>{
    const {article_id} = req.params
    getArticleByID(article_id).then((foundArticle)=>{
        res.status(200).send({article: foundArticle})
    }).catch(next)
}