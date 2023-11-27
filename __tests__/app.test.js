const app = require("../app-files/app");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const db = require("../db/connection");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});
afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET: 200 responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api", () => {
  test("GET 200: responds with available api endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("Error Handling", () => {
  test("ERROR: 400 when given an invalid pathway", () => {
    return request(app)
      .get("/api/not-news-address")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET: 200 responds with the selected article when given a valid id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(3);
        expect(body.article).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("ERROR: 404 responds with an error when a non-existent id is given", () => {
    return request(app)
      .get("/api/articles/89")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("ERROR: 400 responds with an error when given an invalid id", () => {
    return request(app)
      .get("/api/articles/numbers-only")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET: 200 responds with the selected article and the total number of comments for that article by the selected id", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toMatchObject({
          article_id: 9,
          title: "They're not exactly dogs, are they?",
          topic: "mitch",
          author: "butter_bridge",
          body: "Well? Think about it.",
          comment_counts: "2",
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GET: 200 responds with the selected article with comment count even if there are no comments for the selected article by id", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toMatchObject({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_counts: "0",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
});

describe.only(" GET /api/articles", () => {
  test("GET: 200 retrieves all the articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((piece) => {
          expect(piece).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
          expect(piece.hasOwnProperty("body")).toBe(false);
          expect(piece).hasOwnProperty("comment_count");
        });
      });
  });
  test("QUERY: 200 responds with only the relevent articles by topics", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toHaveLength(1);
        articles.forEach((piece) => {
          expect(piece).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: "cats",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
          expect(piece.hasOwnProperty("body")).toBe(false);
          expect(piece).hasOwnProperty("comment_count");
        });
      });
  });
  test("QUERY: 200 returns an empty array if there is no articles but topic exists", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test("ERROR: 404 responds with an error message when query topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("QUERY: 200 responds with an array of all the articles by the sort_by query in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toBeSortedBy("title", { descending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
          expect(article.hasOwnProperty("body")).toBe(false);
          expect(article).hasOwnProperty("comment_count");
        });
      });
  });
  test("ERROR: 404 responds with an error when trying to sort with a non-existing column name", () => {
    return request(app)
      .get("/api/articles?sort_by=songs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("QUERY: 200 should be able to sort ascending or descending order when sort_by is not given", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toBeSortedBy("created_at", { ascending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
          expect(article.hasOwnProperty("body")).toBe(false);
          expect(article).hasOwnProperty("comment_count");
        });
      });
  });
  test("ERROR: 404 when order query is not ASC or DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=letters")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("QUERY: 200 when given a topic and a sort_by query", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=votes")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toBeSortedBy("votes", { descending: true });
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
          expect(article.hasOwnProperty("body")).toBe(false);
          expect(article).hasOwnProperty("comment_count");
        });
      });
  });
  test("QUERY 200: responds with an array of articles when given a topic, a sort_by and an order query", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=author&order=ASC")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toBeSortedBy("author", { ascending: true });
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
          expect(article.hasOwnProperty("body")).toBe(false);
          expect(article).hasOwnProperty("comment_count");
        });
      });
  });
  test("QUERY: 200 responds with an empty array when the queries are all valid but there are no articles with the associated topic", () => {
    return request(app)
      .get("/api/articles?topic=paper&sort_by=title&order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test("ERROR: 404 when topic or sort_by query is an invalid query", () => {
    return request(app)
      .get("/api/articles?topic=laptops&sort_by=title&order=ASC")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  test("GET: 200, responds with an array of comments in ascending order by the article_id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments).toBeSortedBy("created_at", { ascending: true });
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(5);
          expect(comment).toMatchObject({
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_id: expect.any(Number),
            body: expect.any(String),
          });
        });
      });
  });
  test("ERROR: 404, responds with an error message when given a valid but non-exist article_id", () => {
    return request(app)
      .get("/api/articles/67/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("GET: 200 responds when an empty array when article_id exists but no comments has been made", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("ERROR: 400 responds with error message when trying to access by an invalid endpoint", () => {
    return request(app)
      .get("/api/articles/invalid/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("Post: api/articles/:article_id/comments", () => {
  test("POST: 201 adds a new comment for an article", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Contents are not worth reading",
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 19,
          body: "Contents are not worth reading",
          article_id: 7,
          author: "icellusedkars",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("ERROR: 400 responds with an error when the request body does not have all the required information", () => {
    const invalidComment = { username: "rogersop" };
    return request(app)
      .post("/api/articles/5/comments")
      .send(invalidComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("ERROR: 404 responds with an error message when comment is being added to a valid but non-existent article", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Contents are not worth reading",
    };
    return request(app)
      .post("/api/articles/46/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("ERROR: 400 responds with an error message when trying to add comment to an invalid endpoint", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Contents are not worth reading",
    };
    return request(app)
      .post("/api/articles/mouse/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH articles", () => {
  test("PATCH: 200, increases vote by article_id", () => {
    const newVote = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/10")
      .send(newVote)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toMatchObject({
          article_id: 10,
          title: "Seven inspirational thought leaders from Manchester UK",
          topic: "mitch",
          author: "rogersop",
          body: "Who are we kidding, there is only one, and it's Mitch!",
          created_at: expect.any(String),
          votes: 5,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH: 200 decreases the vote by article ID", () => {
    const newVote = { inc_votes: -4 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 96,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("ERROR: 404 responds with an error when trying to decrease the vote to non-existing article (decrease)", () => {
    const newVote = { inc_votes: -4 };
    return request(app)
      .patch("/api/articles/45")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("ERROR: 400 responds with error if patching to an invalid path", () => {
    const newVote = { inc_vote: 45 };
    return request(app)
      .patch("/api/articles/wow")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("ERROR: 400, responds with an error when vote is not a number", () => {
    const newVote = { inc_vote: "six" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("ERROR: 400, responds with an error when no information has been given", () => {
    const newVote = {};
    return request(app)
      .patch("/api/articles/4")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("Delete: Comments", () => {
  test("DELETE: 204, deletes the comment by id", () => {
    return request(app).delete("/api/comments/7").expect(204);
  });
  test("ERROR: 404 responds with an error when comment_id is non-existent", () => {
    return request(app)
      .delete("/api/comments/677")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("ERROR: 400 responds with an error with endpoint is invalid", () => {
    return request(app)
      .delete("/api/comments/snakes")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET users", () => {
  test("GET: 200, responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const { users } = response.body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET username /api/users/:username", () => {
  test("GET: 200 responds with an array with the selected username and their info", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });
  test("ERROR: 404 responds with an error when given a username that does not exist on the database", () => {
    return request(app)
      .get("/api/users/lander_vis")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("ERROR: 400 responds with an error when an invalid endpoint is given", () => {
    return request(app)
      .get("/api/no-users/butter_bridge")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH comment by id", () => {
  test("GET: 200 responds with the array of comment by the id with votes increased", () => {
    const newVote = { inc_votes: 57 };
    return request(app)
      .patch("/api/comments/7")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.comment_id).toBe(7);
        expect(body.comment).toMatchObject({
          body: "Lobster pot",
          votes: 57,
          author: "icellusedkars",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  test('GET: 200 responds with an array of comment by id with the votes decreased if vote send is negative', ()=>{
    const newVote = { inc_votes: -4 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.comment_id).toBe(1);
        expect(body.comment).toMatchObject({
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 12,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
        });
      });
  })
  test('ERROR: 404 responds with an error when trying to patch comment vote with a valid but non-existent comment_id', ()=>{
    const newVote = { inc_votes: 456 };
    return request(app)
    .patch('/api/comments/65')
    .send(newVote)
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe('Not Found')
    })
  })
  test('ERROR: 400 responds with an error when trying to patch comment votes with an invalid endpoint', ()=>{
    const newVote = { inc_votes: 6};
    return request(app)
    .patch('/api/comments/no-comment')
    .send(newVote)
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
  test('ERROR: 400 responds with error when new vote does not include the required information', ()=>{
    const invalidVote = {}
    return request(app)
    .patch('/api/comments/4')
    .send(invalidVote)
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
  test('ERROR: 400 responds with error when new vote contains invalid votes', ()=>{
    const invalidVote = {inc_votes: 'minus 4'}
    return request(app)
    .patch('/api/comments/4')
    .send(invalidVote)
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
});

describe('POST new article', ()=>{
  test('POST: 200 responds with an array of the newly added article', ()=>{
    const newArticle = {
      author : 'lurker',
      title: 'Cats as your neighbour?',
      body: "In Animal Crossing: New Horizon, you CAN have cats are your neighbour on your island, my favourite is Bob, pphthppth",
      topic: 'cats',
      article_img_url : "https://static.wikia.nocookie.net/animalcrossing/images/e/ea/Bob_NH.png/revision/latest?cb=20200817185816"
    }
    return request(app)
    .post('/api/articles')
    .send(newArticle)
    .expect(200)
    .then((response) =>{
      const {article} = response.body
      expect(article).toMatchObject({
        article_id: expect.any(Number),
        author : 'lurker',
        title: 'Cats as your neighbour?',
        body: "In Animal Crossing: New Horizon, you CAN have cats are your neighbour on your island, my favourite is Bob, pphthppth",
        topic: 'cats',
        article_img_url : "https://static.wikia.nocookie.net/animalcrossing/images/e/ea/Bob_NH.png/revision/latest?cb=20200817185816",
        votes: 0,
        created_at: expect.any(String),
        comment_count: '0'
      })
    })
  })
  test('ERROR: 400 responds with an error when trying to add new article without complete information', ()=>{
    const newArticle = {
      author : 'lurker',
      title: 'Cats as your neighbour?',
      article_img_url : "https://static.wikia.nocookie.net/animalcrossing/images/e/ea/Bob_NH.png/revision/latest?cb=20200817185816"
    }
    return request(app)
    .post('/api/articles')
    .send(newArticle)
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
  test('ERROR: 400 responds with an error when trying to post an article without a valid author', ()=>{
    const newArticle = {
      author : 'no account',
      title: 'Cats as your neighbour?',
      body: "In Animal Crossing: New Horizon, you CAN have cats are your neighbour on your island, my favourite is Bob, pphthppth",
      topic: 'cats',
      article_img_url : "https://static.wikia.nocookie.net/animalcrossing/images/e/ea/Bob_NH.png/revision/latest?cb=20200817185816"
    }
    return request(app)
    .post('/api/articles')
    .send(newArticle)
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe('Not Found')
    })
  })
})

describe('POST /api/topics', ()=>{
  test('POST 200: responds with an array with the newly added topic', ()=>{
    const newTopic = {
      slug : "skincare",
      description: "give me good skin"
    }
    return request(app)
    .post('/api/topics')
    .send(newTopic)
    .expect(200)
    .then((response)=>{
      const {topic} = response.body
      expect(topic).toEqual({
        slug : "skincare",
        description: "give me good skin"
      })
    })
  })
  test('ERROR: 400 responds with an error when trying to add a new topic without complete information', ()=>{
    const invalidExample = {
      description: "give me good skin"
    }
    return request(app)
    .post('/api/topics')
    .send(invalidExample)
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
})