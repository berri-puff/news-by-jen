const { checkArticleID } = require("../db/seeds/utils");
const {
  getArticleByID,
  selectAllArticles,
  selectCommentByArticleID,
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
