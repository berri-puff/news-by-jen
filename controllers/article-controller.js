
const { checkArticleID } = require("../db/seeds/utils");
const {
  getArticleByID,
  selectAllArticles,
  insertsNewComment,
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
  selectAllArticles().then((allArticles) => {
    res.status(200).send({ articles: allArticles });
  });
};

exports.postsNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const commentToAdd = req.body;
const addCommentPromise = [checkArticleID('articles', 'article_id', article_id), insertsNewComment(article_id, commentToAdd)]
  Promise.all(addCommentPromise).then((addedComment) => {
    res.status(201).send({ comment: addedComment[1] });
  }).catch(next)
};
