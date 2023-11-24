const { checkArticle } = require(`${__dirname}/../db/seeds/utils`);
const {
  getArticleByID,
  selectAllArticles,
  selectCommentByArticleID,
  insertsNewComment,
  updatesVotes,
} = require(`${__dirname}/../models/article-model`);
const { selectsAllTopics } = require(`${__dirname}/../models/topic-model`);

exports.getsArticle = (req, res, next) => {
  const { article_id } = req.params;
  getArticleByID(article_id)
    .then((foundArticle) => {
      res.status(200).send({ article: foundArticle });
    })
    .catch(next);
};

exports.getsAllArticles = (req, res, next) => {
  const { topic } = req.query;
  const {sort_by} = req.query
  const {order} = req.query
  selectsAllTopics()
    .then((topics) => {
      const validTopics = topics.map((topic) => {
        return topic.slug;
      });
      return validTopics;
    })
    .then((validTopics) => {
      selectAllArticles(topic, validTopics, sort_by, order).then((allArticles) => {
      res.status(200).send({ articles: allArticles });
    }) .catch(next);
    })
    
   
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;

  checkArticle("articles", "article_id", article_id)
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
  insertsNewComment(article_id, commentToAdd)
    .then((addedComment) => {
      res.status(201).send({ comment: addedComment });
    })
    .catch(next);
};

exports.patchArticleVote = (req, res, next) => {
  const { article_id } = req.params;
  const newVote = req.body;
  updatesVotes(article_id, newVote)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};
