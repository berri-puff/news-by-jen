const { checkArticleID } = require("../db/seeds/utils");
const {
  getArticleByID,
  selectAllArticles,
  selectCommentByArticleID,
  insertsNewComment,
  updatesVotes,
} = require("../models/article-model");

exports.getsArticle = (req, res, next) => {
  const { article_id } = req.params;
  getArticleByID(article_id)
    .then((foundArticle) => {
      res.status(200).send({ article: foundArticle });
    })
    .catch(next);
};

exports.getsAllArticles = (req, res, next) => {
  const topic = req.query
  selectAllArticles(topic).then((allArticles) => {
    res.status(200).send({ articles: allArticles });
  }).catch((err)=>{
    console.log(err)
  })
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;

  checkArticleID("articles", "article_id", article_id)
    .then(() => {
      selectCommentByArticleID(article_id).then((relatedComments) => {
        res.status(200).send({ comments: relatedComments });
      });
    })
    .catch(next);
};
exports.postsNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const commentToAdd = req.body;
insertsNewComment(article_id, commentToAdd).then((addedComment) => {
    res.status(201).send({ comment: addedComment});
  }).catch(next)
};

exports.patchArticleVote = (req,res,next) =>{
    const {article_id} = req.params
    const newVote = req.body
    updatesVotes(article_id, newVote).then((updatedArticle) =>{
        res.status(200).send({article: updatedArticle})
    })
    .catch(next)
    }

