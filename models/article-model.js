const db = require("../db/connection");

exports.getArticleByID = (article_id) => {
  return db
  .query(`SELECT articles.*, COUNT(comments.body) AS comment_counts FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`, [article_id])
  .then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    } else {
      return rows[0]}
  });

};

exports.selectAllArticles = (topic, validTopics, sort_by = 'created_at', order = 'DESC') => {
  let queryString = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.body) AS comment_counts FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;
  const validSorts = ['article_id', 'author', 'title', 'topic', 'created_at', 'votes']
  const validOrder = ['ASC', 'DESC']

  if ((topic && !validTopics.includes(topic)) || (sort_by && !validSorts.includes(sort_by))) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  } 
  else if (topic && validTopics.includes(topic)) {
    queryString += `WHERE topic = $1 GROUP BY articles.article_id ORDER BY articles.created_at DESC;`;
    return db.query(queryString, [topic]).then(({ rows }) => {
      return rows;
    });
  } 
  else if (order && validOrder.includes(order) ){
    queryString += `GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order};`
    return db.query(queryString).then(({ rows }) => {
      return rows;
    });
  }
  else if (sort_by && validSorts.includes(sort_by)){
    queryString += `GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order};`
    return db.query(queryString).then(({ rows }) => {
      return rows;
    });
  }

  else {
    queryString += `GROUP BY articles.article_id ORDER BY articles.created_at DESC`;
    return db.query(queryString).then(({ rows }) => {
      return rows;
    });
  }
};

exports.selectCommentByArticleID = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, comments.author, comments.created_at, comments.votes, comments.comment_id, comments.body FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE comments.article_id = $1 ORDER BY comments.created_at`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
exports.updatesVotes = (article_id, newVote) => {
  const { inc_votes } = newVote;
  return db
    .query(`SELECT votes FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        const value = rows[0].votes;
        let changedVote = value + inc_votes;
        return db
          .query(
            `UPDATE articles SET votes = ${changedVote} WHERE article_id = $1 RETURNING *`,
            [article_id]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      }
    });
};

exports.insertsNewComment = (article_id, commentToAdd) => {
  const { username, body } = commentToAdd;
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1,$2,$3) RETURNING *`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
